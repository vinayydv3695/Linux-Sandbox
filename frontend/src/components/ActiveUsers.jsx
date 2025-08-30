import React from 'react';

const ActiveUsers = ({ activeUsers }) => {
    return (
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="font-bold">Active Users:</span>
            {activeUsers.map(activeUser => (
                <span key={activeUser.uid} className="flex items-center gap-1 rounded-full p-2 bg-gray-700 text-white">
                    <span className="text-xl">{activeUser.avatar}</span>
                    <span className="text-xs">...{activeUser.uid.slice(-4)}</span>
                </span>
            ))}
        </div>
    );
};

export default ActiveUsers;
