import React, { useState } from 'react';/* 
import api from '../api'; */
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            login(res.data.token);

            console.log('logged in')
        } catch (err) {
            setError('Invalid credentials');
        }
        const token = localStorage.getItem('token');

        if (token) {
            console.log('JWT token exists:', token);
        } else {
            console.log('No JWT token found in localStorage');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;
