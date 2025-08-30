import { useState, useEffect } from 'react';

const useSession = () => {
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        const storedSessionId = localStorage.getItem('linux_session_id');
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = crypto.randomUUID().split('-')[0];
            localStorage.setItem('linux_session_id', newSessionId);
            setSessionId(newSessionId);
        }
    }, []);

    return { sessionId };
};

export default useSession;
