import React, { useState, useRef, useEffect } from 'react';

const Terminal = ({ history, isLoading, currentPath, terminalRef, onCommandSubmit, command, setCommand, handleKeyDown, cursorPositions, user }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        setCommand(e.target.value);
        setCursorPosition(e.target.selectionStart);
    };

    const filteredHistory = history.filter(entry => {
        const input = entry.input || '';
        const output = entry.output || '';
        return input.includes(searchQuery) || output.includes(searchQuery);
    });

    return (
        <div className="h-full flex flex-col">
            <div className="bg-gray-700/50 p-2 rounded-t-xl border-b border-gray-600/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-300">Terminal</h2>
                <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800/50 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div className="flex-1 p-4 overflow-y-auto" ref={terminalRef}>
                <pre className="whitespace-pre-wrap text-sm">
                    {filteredHistory.map((entry) => (
                        <div key={entry.id} className="mb-2">
                            <div className="flex items-center">
                                <span className="text-green-400">user@sandbox</span>
                                <span className="text-gray-500">:</span>
                                <span className="text-blue-400">{currentPath}</span>
                                <span className="text-gray-500">$</span>
                                <span className="text-gray-300 ml-2">{entry.input}</span>
                            </div>
                            <div className={`mt-1 ${entry.error ? 'text-red-400' : 'text-gray-400'}`}>
                                {entry.output}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center text-sm text-gray-400">
                            <svg className="animate-spin h-4 w-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Executing...
                        </div>
                    )}
                </pre>
                <div className="flex items-center relative">
                    <span className="text-green-400">user@sandbox</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-blue-400">{currentPath}</span>
                    <span className="text-gray-500">$</span>
                    <form onSubmit={onCommandSubmit} className="flex-1 ml-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={command}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-300"
                        />
                    </form>
                    {Object.entries(cursorPositions).map(([uid, data]) => {
                        if (uid !== user.uid) {
                            return (
                                <div
                                    key={uid}
                                    className="absolute bg-red-500 w-0.5 h-4"
                                    style={{ left: `${data.position * 8}px` }} // Assuming monospace font with 8px width
                                ></div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default Terminal;
