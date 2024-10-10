import React, { useState } from 'react';
import axios from 'axios';

const Forgotpassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
            setMessage(response.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'Server error');
        }
    };

    return (
        <form onSubmit={handleForgotPassword}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button type="submit">Send Reset Link</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Forgotpassword;
