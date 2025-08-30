import React, { useState } from 'react';
import { fileSystemData } from '../helpers/utils';

const FileSystemTree = ({ currentPath, navigateTo, onFileSystemUpdate }) => {
    const [renamingPath, setRenamingPath] = useState(null);
    const [newName, setNewName] = useState('');

    const handleRename = (path) => {
        setRenamingPath(path);
        setNewName(path.split('/').pop());
    };

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        onFileSystemUpdate('rename', renamingPath, newName);
        setRenamingPath(null);
        setNewName('');
    };

    const renderTree = (path, level = 0) => {
        const items = fileSystemData[path] || [];
        return (
            <ul className={level > 0 ? "pl-4" : ""}>
                {items.map((item, index) => {
                    const newPath = path === '/' ? `/${item}` : `${path}/${item}`;
                    const isDirectory = fileSystemData[newPath];
                    const icon = isDirectory ? '📁' : '📄';
                    const name = isDirectory ? `${item}/` : item;
                    const isActive = newPath === currentPath;

                    return (
                        <li key={index}
                            className={`flex items-center justify-between text-sm py-1 px-2 rounded-md transition-colors ${
                                isActive ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-gray-700/50'
                            }`}
                        >
                            <div
                                onClick={() => isDirectory && navigateTo(item)}
                                className={`flex items-center flex-grow ${isDirectory ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span className="mr-2">{icon}</span>
                                {renamingPath === newPath ? (
                                    <form onSubmit={handleRenameSubmit}>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => setRenamingPath(null)}
                                            autoFocus
                                            className="bg-gray-800/50 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </form>
                                ) : (
                                    <span>{name}</span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <button onClick={() => handleRename(newPath)} className="text-xs p-1 rounded hover:bg-gray-600">Rename</button>
                                <button onClick={() => onFileSystemUpdate('delete', newPath)} className="text-xs p-1 rounded hover:bg-gray-600">Delete</button>
                            </div>
                        </li>
                    );
                })}
                <li className="flex items-center text-sm py-1 px-2 rounded-md transition-colors hover:bg-gray-700/50 cursor-pointer">
                    <button onClick={() => onFileSystemUpdate('createFile', currentPath)} className="text-xs p-1 rounded hover:bg-gray-600">+ File</button>
                    <button onClick={() => onFileSystemUpdate('createDirectory', currentPath)} className="text-xs p-1 rounded hover:bg-gray-600">+ Folder</button>
                </li>
            </ul>
        );
    };

    return (
        <div className="h-full p-4 text-gray-300">
            <h2 className="text-lg font-bold mb-4 px-2">File System</h2>
            {renderTree('/')}
        </div>
    );
};

export default FileSystemTree;
