import React from 'react';
import { fileSystemData } from '../helpers/utils';

const FileSystemTree = ({ currentPath, navigateTo }) => {
    const renderTree = (path) => {
        const items = fileSystemData[path] || [];
        return (
            <ul className="pl-4">
                {items.map((item, index) => {
                    const isDirectory = fileSystemData[`${path}${path === '/' ? '' : '/'}${item}`];
                    const icon = isDirectory ? '📂' : '📄';
                    const name = isDirectory ? `${item}/` : item;
                    return (
                        <li key={index}
                            onClick={() => isDirectory && navigateTo(name)}
                            className="flex items-center text-sm cursor-pointer hover:bg-gray-700 rounded-md transition-colors">
                            <span className="text-gray-500 mr-2">{icon}</span>
                            <span className="text-white">{name}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };
    return (
        <div className="md:w-1/4 bg-gray-700 p-6 rounded-xl overflow-y-auto border border-gray-600">
            <h2 className="text-xl font-bold mb-4">File System</h2>
            {renderTree('/')}
        </div>
    );
};

export default FileSystemTree;
