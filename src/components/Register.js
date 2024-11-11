import axios from 'axios';
import { useState } from 'react';
import "../styles/Register.css"

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                username: name,
                email,
                password,
            });

            // Handle the success message here
            setMessage(response.data.msg);
        } catch (error) {
            console.error('Error registering user:', error.response?.data?.msg || error.message);
            setError('Registration failed: ' + (error.response?.data?.msg || 'Server error'));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Register;
