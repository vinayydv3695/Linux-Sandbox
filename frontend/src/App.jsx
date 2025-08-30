import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, addDoc, doc, setDoc, query } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage, appId } from './services/firebase';
import { getUserVisuals, fileSystemData } from './helpers/utils';
import useAuth from './hooks/useAuth';
import useSession from './hooks/useSession';
import useFileSystem from './hooks/useFileSystem';
import FileSystemTree from './components/FileSystemTree';
import ChatWindow from './components/ChatWindow';
import Terminal from './components/Terminal';
import ActiveUsers from './components/ActiveUsers';

const App = () => {
    const { user, isAuthReady } = useAuth();
    const { sessionId } = useSession();
    const { currentPath, navigateTo } = useFileSystem('/');

    // --- State Management ---
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeUsers, setActiveUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);

    // --- Refs for auto-scrolling ---
    const terminalRef = useRef(null);
    const chatRef = useRef(null);

    // Real-time listeners for commands, users, and messages
    useEffect(() => {
        if (!db || !isAuthReady || !sessionId) return;
        const sessionDocRef = doc(db, `artifacts/${appId}/public/data/linux_sessions`, sessionId);

        const qCommands = query(collection(sessionDocRef, 'commands'));
        const unsubscribeCommands = onSnapshot(qCommands, (snapshot) => {
            const updatedHistory = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.createdAt - b.createdAt);
            setHistory(updatedHistory);
            setCommandHistory(updatedHistory.map(h => h.input).filter(input => input));
            setIsLoading(false);
        }, (error) => {
            console.error('Failed to fetch command history:', error);
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

        const presenceInterval = setInterval(async () => {
            if (user && db) {
                const userDocRef = doc(db, `artifacts/${appId}/public/data/linux_sessions`, sessionId, 'users', user.uid);
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
            clearInterval(presenceInterval);
        };
    }, [db, isAuthReady, sessionId, user]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [history, messages]);

    const handleCommandSubmit = async (e) => {
        e.preventDefault();
        const trimmedCommand = command.trim();
        if (trimmedCommand === '' || !db || !user) return;
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
            const sessionDocRef = doc(db, `artifacts/${appId}/public/data/linux_sessions`, sessionId);
            await addDoc(collection(sessionDocRef, 'commands'), newCommandEntry);
            
            setTimeout(async () => {
                let mockOutput;
                let mockError = false;
                if (trimmedCommand === 'ls') {
                    mockOutput = fileSystemData[currentPath]?.join('  ') || 'No such directory.';
                } else if (trimmedCommand.startsWith('cd ')) {
                    const newPath = trimmedCommand.substring(3).trim();
                    const navigated = navigateTo(newPath);
                    if (navigated) {
                        mockOutput = '';
                    } else {
                        mockOutput = `cd: ${newPath}: No such file or directory`;
                        mockError = true;
                    }
                } else if (trimmedCommand === 'pwd') {
                    mockOutput = currentPath;
                } else {
                    mockOutput = `bash: ${trimmedCommand}: command not found`;
                    mockError = true;
                }
                
                const updatedCommandEntry = {
                    ...newCommandEntry,
                    output: mockOutput,
                    executedAt: Date.now(),
                    error: mockError,
                };
                await addDoc(collection(sessionDocRef, 'commands'), updatedCommandEntry);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error adding document:', error);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
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
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        const trimmedMessage = messageInput.trim();
        if (trimmedMessage === '' || !db || !user) return;
        
        try {
            const sessionDocRef = doc(db, `artifacts/${appId}/public/data/linux_sessions`, sessionId);
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
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user || !storage) return;

        const storagePath = `artifacts/${appId}/users/${user.uid}/files/${file.name}`;
        const fileRef = ref(storage, storagePath);

        setIsLoading(true);
        const commandEntry = {
            input: `upload ${file.name}`,
            output: 'Uploading file...',
            createdAt: Date.now(),
            authorId: user.uid,
            ...getUserVisuals(user.uid)
        };
        const sessionDocRef = doc(db, `artifacts/${appId}/public/data/linux_sessions`, sessionId);
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
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8 font-mono antialiased">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="max-w-7xl mx-auto rounded-2xl shadow-2xl p-6 md:p-12 space-y-8 bg-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 md:mb-0 text-center">
                        Linux Sandbox
                    </h1>
                    {user && (
                        <div className="bg-gray-700 text-sm text-gray-400 p-2 rounded-lg font-mono break-all text-center">
                            Session ID: {sessionId} <br className="md:hidden" /> User ID: ...{user.uid.slice(-4)}
                        </div>
                    )}
                </div>

                <ActiveUsers activeUsers={activeUsers} />

                <div className="flex flex-col md:flex-row gap-8 h-[60vh]">
                    <FileSystemTree currentPath={currentPath} navigateTo={navigateTo} />
                    <Terminal history={history} isLoading={isLoading} currentPath={currentPath} terminalRef={terminalRef} />
                    <ChatWindow messages={messages} messageInput={messageInput} setMessageInput={setMessageInput} handleMessageSubmit={handleMessageSubmit} chatRef={chatRef} />
                </div>

                <form onSubmit={handleCommandSubmit} className="flex gap-4 items-center" onKeyDown={handleKeyDown}>
                    <span className="text-green-400 hidden sm:inline">user@sandbox:<span className="text-yellow-400">{currentPath}</span>$</span>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command..."
                        className="flex-1 p-4 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                    >
                        Run
                    </button>
                    <label className="p-4 bg-gray-500 text-white rounded-xl shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105 cursor-pointer">
                        <span className="mr-2">📁</span>Upload File
                        <input type="file" onChange={handleFileUpload} className="hidden" />
                    </label>
                </form>
            </div>
        </div>
    );
};

export default App;
