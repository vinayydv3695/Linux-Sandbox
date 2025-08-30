import { useState } from 'react';
import { fileSystemData } from '../helpers/utils';

const useFileSystem = (initialPath) => {
    const [currentPath, setCurrentPath] = useState(initialPath);
    const navigateTo = (path) => {
        const absolutePath = path.startsWith('/') ? path : `${currentPath === '/' ? '' : currentPath}/${path}`;
        if (fileSystemData[absolutePath]) {
            setCurrentPath(absolutePath);
            return true;
        }
        return false;
    };
    return { currentPath, navigateTo };
};

export default useFileSystem;
