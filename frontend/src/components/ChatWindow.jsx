import React from 'react';

const ChatWindow = ({ messages, messageInput, setMessageInput, handleMessageSubmit, chatRef }) => {
    return (
        <div className="md:w-1/4 bg-gray-700 p-6 rounded-xl border border-gray-600 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Chat</h2>
            <div className="overflow-y-auto flex-1 mb-4" ref={chatRef}>
                {messages.map(msg => (
                    <div key={msg.id} className="mb-2">
                        <span className="font-bold mr-2" style={{ color: msg.color }}>{msg.avatar} ...{msg.authorId.slice(-4)}:</span>
                        <span className="text-gray-300">{msg.text}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button type="submit" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
