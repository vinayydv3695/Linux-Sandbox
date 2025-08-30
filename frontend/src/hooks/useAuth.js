import { useState, useEffect } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { auth, initialAuthToken } from '../services/firebase';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error('Firebase authentication failed:', error);
                }
            }
            setUser(currentUser);
            setIsAuthReady(true);
        });
        return () => authUnsubscribe();
    }, []);

    return { user, isAuthReady };
};

export default useAuth;
