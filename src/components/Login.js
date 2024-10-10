// import React, { useState } from 'react';/* 
// import api from '../api'; */
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';


// const Login = ({ onLogin }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const { login } = useAuth();

//     const handleLogin = async (e) => {
//         console.log(process.env.REACT_APP_TITLE)
//         e.preventDefault();
//         try {
//             const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
//             login(res.data.token);

//             console.log('logged in')
//         } catch (err) {
//             setError('Invalid credentials');
//         }
//         const token = localStorage.getItem('token');

//         if (token) {
//             console.log('JWT token exists:', token);
//         } else {
//             console.log('No JWT token found in localStorage');
//         }
//     };

//     return (
//         <form onSubmit={handleLogin}>
//             <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//             />
//             <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//             />
//             <button type="submit">Login</button>
//             {error && <p>{error}</p>}
//         </form>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async (e) => {
        console.log(process.env.REACT_APP_TITLE)
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
            <Link to="/forgot-password">Forgot your password?</Link>
        </form>
    );
};

export default Login;
