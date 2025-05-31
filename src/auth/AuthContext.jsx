import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookieutils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // tambahan loading state

    useEffect(() => {
        const userCookie = getCookie('user');
        if (userCookie) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(userCookie));
                setUser(parsedUser);
            } catch (e) {
                console.error('Invalid user cookie');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false); // selesai load cookie
    }, []);

    const login = async (credentials) => {
        const result = await api.login(credentials);

        if (!result || result.error || !result.token || !result.user || !result.role) {
            return { error: result?.error || 'Login gagal. Coba lagi.' };
        }

        const userData = {
            token: result.token,
            user: result.user,
            role: result.role.role,
        };

        setCookie('user', encodeURIComponent(JSON.stringify(userData)), 1);
        setUser(userData);

        return { role: userData.role };
    };

    const logout = () => {
        setUser(null);
        deleteCookie('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
