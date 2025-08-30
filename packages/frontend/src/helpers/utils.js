export const getUserVisuals = (uid) => {
    const hash = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'].length;
    const avatarIndex = hash % ['😊', '😎', '💻', '🚀', '🤖', '👾', '🌟', '🔥'].length;
    return {
        color: ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'][colorIndex],
        avatar: ['😊', '😎', '💻', '🚀', '🤖', '👾', '🌟', '🔥'][avatarIndex]
    };
};

export const fileSystemData = {
    '/': ['home', 'etc', 'usr', 'bin'],
    '/home': ['user1', 'user2'],
    '/etc': ['config.conf', 'hosts'],
    '/usr': ['local', 'bin'],
    '/bin': ['ls', 'cd', 'cat'],
};
