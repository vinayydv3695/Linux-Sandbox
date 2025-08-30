import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, addDoc, doc, setDoc, query } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import { FiSend, FiUpload, FiChevronRight, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';

import ActiveUsers from './components/ActiveUsers';
import FileSystemTree from './components/FileSystemTree';
import Terminal from './components/Terminal';
import ChatWindow from './components/ChatWindow';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './components/LoginPage';
import CodeEditor from './components/CodeEditor';
import { firebaseConfig } from './services/firebaseConfig';
import { initialFileSystem } from './data/fileSystem';
import { db, storage } from './services/firebase';

// --- Firestore Collection Root ---
const COLLECTION_ROOT = `artifacts/${firebaseConfig.appId}/public/data`;

// --- Helper Functions ---
const getUserVisuals = (uid) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#247BA0', '#70C1B3'];
    const color = colors[uid.charCodeAt(0) % colors.length];
    return { color };
};

// --- Custom Hooks ---
const useSession = () => {
    const [sessionId] = useState("default_session");
    return { sessionId };
};

const useFileSystem = (initialPath) => {
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [fileSystem, setFileSystem] = useState(initialFileSystem);

    const navigateTo = useCallback((newPath) => {
        if (fileSystem[newPath] !== undefined && Array.isArray(fileSystem[newPath])) {
            setCurrentPath(newPath);
            return true;
        }
        return false;
    }, [fileSystem]);

    const handleFileSystemUpdate = useCallback((operation, path, newName) => {
        // In a real app, you'd update this on a server and sync with Firestore
        const newFileSystem = { ...fileSystem };

        if (operation === 'createFile') {
            const fileName = prompt("Enter file name");
            if (fileName) {
                newFileSystem[path].push(fileName);
                newFileSystem[`${path}/${fileName}`] = ''; // It's a file with empty content
            }
        } else if (operation === 'createDirectory') {
            const dirName = prompt("Enter directory name");
            if (dirName) {
                newFileSystem[path].push(dirName);
                newFileSystem[`${path}/${dirName}`] = []; // It's a directory
            }
        } else if (operation === 'delete') {
            const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
            const itemName = path.split('/').pop();
            newFileSystem[parentPath] = newFileSystem[parentPath].filter(item => item !== itemName);
            delete newFileSystem[path];
        } else if (operation === 'rename') {
            const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
            const oldName = path.split('/').pop();
            const newPath = `${parentPath}/${newName}`;

            newFileSystem[parentPath] = newFileSystem[parentPath].map(item => item === oldName ? newName : item);
            newFileSystem[newPath] = newFileSystem[path];
            delete newFileSystem[path];
        }

        setFileSystem(newFileSystem);
    }, [fileSystem]);

    return { currentPath, navigateTo, fileSystem, handleFileSystemUpdate };
};


// --- Main App Component ---
const App = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthReady, logout, login } = useAuth();
    const { sessionId } = useSession();
    const { currentPath, navigateTo, fileSystem, handleFileSystemUpdate } = useFileSystem('/');

    // --- State Management ---
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeUsers, setActiveUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
    const [cursorPositions, setCursorPositions] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    // --- Refs for auto-scrolling ---
    const terminalRef = useRef(null);
    const chatRef = useRef(null);

    // Real-time listeners
    useEffect(() => {
        if (!isAuthReady || !sessionId || !user) return;
        const sessionDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId);

        const qCommands = query(collection(sessionDocRef, 'commands'));
        const unsubscribeCommands = onSnapshot(qCommands, (snapshot) => {
            const updatedHistory = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.createdAt - b.createdAt);
            setHistory(updatedHistory);
            setCommandHistory(updatedHistory.map(h => h.input).filter(input => input));
            setIsLoading(false);
        });

        const usersRef = collection(sessionDocRef, 'users');
        const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
            const usersList = snapshot.docs.map(doc => doc.data());
            const activeNow = usersList.filter(u => Date.now() - u.lastActive < 60000);
            setActiveUsers(activeNow);
        });

        const qMessages = query(collection(sessionDocRef, 'messages'));
        const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
            const updatedMessages = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.timestamp - b.timestamp);
            setMessages(updatedMessages);
        });

        const qCursorPositions = query(collection(sessionDocRef, 'cursor_positions'));
        const unsubscribeCursorPositions = onSnapshot(qCursorPositions, (snapshot) => {
            const positions = {};
            snapshot.forEach(doc => {
                positions[doc.id] = doc.data();
            });
            setCursorPositions(positions);
        });

        const presenceInterval = setInterval(async () => {
            if (user) {
                const userDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId, 'users', user.uid);
                await setDoc(userDocRef, {
                    uid: user.uid,
                    lastActive: Date.now(),
                    role: 'guest',
                    ...getUserVisuals(user.uid)
                }, { merge: true });
            }
        }, 10000);

        return () => {
            unsubscribeCommands();
            unsubscribeUsers();
            unsubscribeMessages();
            unsubscribeCursorPositions();
            clearInterval(presenceInterval);
        };
    }, [isAuthReady, sessionId, user]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [history, messages]);

    const handleCommandSubmit = useCallback(async (e) => {
        e.preventDefault();
        const trimmedCommand = command.trim();
        if (trimmedCommand === '' || !user) return;
        setIsLoading(true);
        setCommand('');

        const newCommandEntry = {
            input: trimmedCommand,
            output: 'Executing...',
            createdAt: Date.now(),
            authorId: user.uid,
            ...getUserVisuals(user.uid)
        };

        try {
            const sessionDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId);
            const docRef = await addDoc(collection(sessionDocRef, 'commands'), newCommandEntry);

            setTimeout(async () => {
                let mockOutput;
                let mockError = false;
                if (trimmedCommand === 'ls') {
                    mockOutput = fileSystem[currentPath]?.join('  ') || 'No such directory.';
                } else if (trimmedCommand.startsWith('cd ')) {
                    const newPath = trimmedCommand.substring(3).trim();
                    if (navigateTo(newPath)) {
                        mockOutput = '';
                    } else {
                        mockOutput = `cd: ${newPath}: No such file or directory`;
                        mockError = true;
                    }
                } else if (trimmedCommand === 'pwd') {
                    mockOutput = currentPath;
                } else if (trimmedCommand.startsWith('cat ')) {
                    const filePath = trimmedCommand.substring(4).trim();
                    if (fileSystem[filePath] !== undefined && fileSystem[filePath] !== null) {
                        mockOutput = fileSystem[filePath];
                    } else {
                        mockOutput = `cat: ${filePath}: No such file or directory`;
                        mockError = true;
                    }
                } else {
                    mockOutput = `bash: ${trimmedCommand}: command not found`;
                    mockError = true;
                }

                await setDoc(docRef, {
                    ...newCommandEntry,
                    output: mockOutput,
                    executedAt: Date.now(),
                    error: mockError,
                }, { merge: true });
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error adding document:', error);
            setIsLoading(false);
        }
    }, [command, user, currentPath, navigateTo, sessionId, fileSystem]);

    const handleKeyDown = useCallback(async (e) => {
        if (e.key === 'ArrowUp' && commandHistory.length > 0) {
            const newIndex = Math.min(commandHistoryIndex + 1, commandHistory.length - 1);
            setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            setCommandHistoryIndex(newIndex);
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && commandHistory.length > 0) {
            const newIndex = Math.max(commandHistoryIndex - 1, -1);
            if (newIndex === -1) {
                setCommand('');
            } else {
                setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
            }
            setCommandHistoryIndex(newIndex);
            e.preventDefault();
        }
        if (user) {
            const cursorDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId, 'cursor_positions', user.uid);
            await setDoc(cursorDocRef, { position: e.target.selectionStart });
        }
    }, [commandHistory, commandHistoryIndex, user, sessionId]);

    const handleMessageSubmit = useCallback(async (e) => {
        e.preventDefault();
        const trimmedMessage = messageInput.trim();
        if (trimmedMessage === '' || !user) return;

        try {
            const sessionDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId);
            await addDoc(collection(sessionDocRef, 'messages'), {
                text: trimmedMessage,
                authorId: user.uid,
                timestamp: Date.now(),
                ...getUserVisuals(user.uid),
            });
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [messageInput, user, sessionId]);

    const handleFileUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        const storagePath = `artifacts/${firebaseConfig.appId}/users/${user.uid}/files/${file.name}`;
        const fileRef = ref(storage, storagePath);

        setIsLoading(true);
        const commandEntry = {
            input: `upload ${file.name}`,
            output: 'Uploading file...',
            createdAt: Date.now(),
            authorId: user.uid,
            ...getUserVisuals(user.uid)
        };
        const sessionDocRef = doc(db, `${COLLECTION_ROOT}/linux_sessions`, sessionId);
        const docRef = await addDoc(collection(sessionDocRef, 'commands'), commandEntry);

        try {
            await uploadBytes(fileRef, file);
            await setDoc(docRef, {
                ...commandEntry,
                output: `File '${file.name}' uploaded successfully.`,
                executedAt: Date.now(),
                error: false,
            }, { merge: true });
        } catch (error) {
            console.error("Upload failed:", error);
            await setDoc(docRef, {
                ...commandEntry,
                output: `Upload failed: ${error.message}`,
                executedAt: Date.now(),
                error: true,
            }, { merge: true });
        } finally {
            setIsLoading(false);
        }
    }, [user, sessionId]);

    const handleFileSelect = useCallback((path) => {
        if (fileSystem[path] !== null) {
            setSelectedFile(path);
            setFileContent(fileSystem[path]);
        }
    }, [fileSystem]);

    const handleFileContentChange = useCallback((newContent) => {
        setFileContent(newContent);
        const newFileSystem = { ...fileSystem };
        newFileSystem[selectedFile] = newContent;
        // In a real app, you'd save this to Firestore
    }, [fileSystem, selectedFile]);

    if (!isAuthReady) {
        return <div>Loading...</div>; // Or a proper loader
    }

    if (!user) {
        return <LoginPage login={login} />;
    }

    return (
        <ErrorBoundary>
            <div className={theme}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 sm:p-6 lg:p-8 font-sans antialiased"
                >
                    <div className="max-w-screen-2xl mx-auto rounded-2xl shadow-2xl bg-gray-100 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50">
                        <header className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between">
                            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2 sm:mb-0">
                                Linux Sandbox
                            </h1>
                            <div className="flex items-center">
                                {user && (
                                    <div className="bg-gray-200 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400 p-2 rounded-lg font-mono break-all text-center">
                                        <span>Session: {sessionId}</span>
                                        <span className="mx-2">|</span>
                                        <span>User: ...{user.uid.slice(-4)}</span>
                                        <button onClick={logout} className="ml-4 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                                            Logout
                                        </button>
                                    </div>
                                )}
                                <button onClick={toggleTheme} className="ml-4 p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                                </button>
                            </div>
                            <ActiveUsers activeUsers={activeUsers} />
                        </header>

                        <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-[calc(100vh-230px)]">
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="lg:col-span-1 md:col-span-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden"
                            >
                                <FileSystemTree
                                    currentPath={currentPath}
                                    navigateTo={handleFileSelect}
                                    onFileSystemUpdate={handleFileSystemUpdate}
                                    fileSystem={fileSystem}
                                />
                            </motion.div>
                            <div className="md:col-span-2 lg:col-span-3 grid grid-rows-2 gap-4">
                                {selectedFile ? (
                                    <CodeEditor
                                        fileContent={fileContent}
                                        onFileContentChange={handleFileContentChange}
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="row-span-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden"
                                    >
                                        <Terminal
                                            history={history}
                                            isLoading={isLoading}
                                            currentPath={currentPath}
                                            terminalRef={terminalRef}
                                            onCommandSubmit={handleCommandSubmit}
                                            command={command}
                                            setCommand={setCommand}
                                            handleKeyDown={handleKeyDown}
                                            cursorPositions={cursorPositions}
                                            user={user}
                                        />
                                    </motion.div>
                                )}
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="row-span-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-hidden"
                                >
                                    <ChatWindow messages={messages} messageInput={messageInput} setMessageInput={setMessageInput} handleMessageSubmit={handleMessageSubmit} chatRef={chatRef} />
                                </motion.div>
                            </div>
                        </main>

                        <footer className="px-6 py-4 border-t border-gray-200 dark:border-gray-700/50">
                            <form onSubmit={handleCommandSubmit} className="flex gap-4 items-center" onKeyDown={handleKeyDown}>
                                <div className="flex items-center flex-1">
                                    <FiChevronRight className="text-green-400 text-xl" />
                                    <input
                                        type="text"
                                        value={command}
                                        onChange={(e) => setCommand(e.target.value)}
                                        placeholder="Enter command..."
                                        className="flex-1 p-3 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <FiSend />
                                </motion.button>
                                <motion.label
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-gray-500 text-white rounded-xl shadow-lg hover:bg-gray-600 cursor-pointer"
                                >
                                    <FiUpload />
                                    <input type="file" onChange={handleFileUpload} className="hidden" />
                                </motion.label>
                            </form>
                        </footer>
                    </div>
                </motion.div>
            </div>
        </ErrorBoundary>
    );
};

export default App;

