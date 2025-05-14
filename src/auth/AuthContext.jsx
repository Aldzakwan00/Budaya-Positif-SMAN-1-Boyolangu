import React from 'react'
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setuser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (username, password) => {
        const accounts = [
            { username: 'guru', password: 'guru123', role: 'guru' },
            { username: 'siswa', password: 'siswa123', role: 'siswa' },
        ];

        const matched = accounts.find(
            (acc) => acc.username === username && acc.password === password
        );

        if (matched) {
            const userData = { username: matched.username, role: matched.role };
            setuser({ username: matched.username, role: matched.role });
            localStorage.setItem('user', JSON.stringify(userData));
            return matched.role;
        } else {
            return null;
        }
    };

    const logout = () => {
        setuser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);