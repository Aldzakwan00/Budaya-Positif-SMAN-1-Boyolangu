import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (credentials) => {
        const result = await api.login(credentials);

        if (result.error) {
            throw new Error(result.error);
        }

        const userData = {
            token: result.token,
            user: result.user,
            role: result.role.role,
        };

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData.role;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
