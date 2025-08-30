import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';

const LoginPage = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setUser(userCredential.user);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setUser(userCredential.user);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
