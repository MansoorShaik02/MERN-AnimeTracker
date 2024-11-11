import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Passwordreset = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams()
    const navigate = useNavigate();
    console.log(token)

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
            setMessage(response.data.msg);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.msg || 'Server error');
        }
    };

    return (
        <form onSubmit={handleResetPassword}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
            />
            <button type="submit">Reset Password</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Passwordreset;
