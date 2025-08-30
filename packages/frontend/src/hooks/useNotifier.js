import React, { useState, useCallback } from 'react';

export const useNotifier = () => {
    const [notification, setNotification] = useState(null);

    const notify = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    return { notification, notify };
};
