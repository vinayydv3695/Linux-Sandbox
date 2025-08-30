import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, [auth]);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return { user, isAuthReady, logout, setUser };
};