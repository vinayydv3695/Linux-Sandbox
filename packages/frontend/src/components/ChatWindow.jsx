import React from 'react';

const ChatWindow = ({ messages, messageInput, setMessageInput, handleMessageSubmit, chatRef }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="bg-gray-700/50 p-2 rounded-t-xl border-b border-gray-600/50">
                <h2 className="text-sm font-bold text-gray-300">Chat</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto" ref={chatRef}>
                {messages.map(msg => (
                    <div key={msg.id} className="mb-3 flex items-start">
                        <span className="text-lg mr-3" style={{ color: msg.color }}>{msg.avatar}</span>
                        <div className="flex-1">
                            <span className="font-bold text-sm text-gray-400">...{msg.authorId.slice(-4)}</span>
                            <p className="text-gray-300 text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4">
                <form onSubmit={handleMessageSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                    />
                    <button type="submit" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors text-white font-semibold">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;