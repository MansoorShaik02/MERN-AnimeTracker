// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated when the app loads
        const checkAuth = async () => {
            try {
                await axios.get('http://localhost:5000/api/users/userlists', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
