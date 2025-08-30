import React from 'react';

const Terminal = ({ history, isLoading, currentPath, terminalRef }) => {
    return (
        <div className="flex-1 bg-gray-700 p-6 rounded-xl overflow-y-auto border border-gray-600">
            <pre className="whitespace-pre-wrap" ref={terminalRef}>
                {history.map((entry) => (
                    <div key={entry.id} className="text-sm mb-4">
                        <span style={{ color: entry.color }}>
                            {entry.avatar} user@sandbox:<span className="text-yellow-400">{currentPath}</span>$
                        </span> <span className="text-white">{entry.input}</span>
                        <div className={`mt-1 text-gray-400 ${entry.error ? 'text-red-400' : ''}`}>
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
        </div>
    );
};

export default Terminal;
