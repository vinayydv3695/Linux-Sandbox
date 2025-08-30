import React from 'react';
import { motion } from 'framer-motion';

const Notification = ({ notification }) => {
    if (!notification) {
        return null;
    }

    const { message, type } = notification;

    const bgColor = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
    }[type];

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-5 right-5 p-4 rounded-lg text-white ${bgColor}`}
        >
            {message}
        </motion.div>
    );
};

export default Notification;
