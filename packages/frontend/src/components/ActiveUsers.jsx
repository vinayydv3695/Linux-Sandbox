import React from 'react';

const ActiveUsers = ({ activeUsers }) => {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="font-bold text-gray-300">Active Users:</span>
            <div className="flex flex-wrap items-center gap-2">
                {activeUsers.map(activeUser => (
                    <div key={activeUser.uid} className="flex items-center gap-2 rounded-full py-1 px-3 bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer">
                        <span className="text-lg">{activeUser.avatar}</span>
                        <span className="text-xs font-medium text-gray-300">...{activeUser.uid.slice(-4)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUsers;