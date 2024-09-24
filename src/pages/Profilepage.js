

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Login from '../components/Login';
import Register from '../components/Register';
const Profilepage = () => {
    const { isAuthenticated, logout } = useAuth();


    //  const { isAuthenticated } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [watchedlist, setWatchedlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAuthenticatedlogin, setIsAuthenticatedlogin] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(''); // State to control the logout message

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            console.log('JWT token exists:', token);
            setIsAuthenticatedlogin(true);
        } else {
            console.log('No JWT token found in localStorage');
        }
    }, []);

    const handleLogin = (status) => {
        setIsAuthenticatedlogin(status);
        setLogoutMessage(''); // Clear logout message when logged in
    };

    const handleLogout = () => {

        setWatchedlist([])
        setWatchlist([])
        setIsAuthenticatedlogin(false)
        const token = localStorage.getItem('token');

        if (token) {
            localStorage.removeItem('token'); // Remove token from localStorage
            setIsAuthenticatedlogin(false);
            setLogoutMessage('You have been logged out successfully.');
            console.log("logged out");



        } else {
            setLogoutMessage('Login first to log out.');
            console.log('No JWT token found in localStorage');
        }
    };


    useEffect(() => {
        const fetchUserLists = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/userlists', {
                    headers: { 'x-auth-token': token }
                });
                setWatchlist(response.data.watchlist);
                setWatchedlist(response.data.watchedlist);
            } catch (err) {
                console.error('Error fetching user lists:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserLists();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <>You need to log in to view your lists.

            <Login onLogin={handleLogin} />
            <p>Register</p>
            <Register />
            {/* <button onClick={handleLogout}>Logout</button> */}
            <button onClick={logout}>Logout</button>

        </>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>

            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <p>You are logged in!</p>
            )}
            <button onClick={handleLogout}>Logout</button>

            {logoutMessage && (
                <div className="logout-message">
                    <p>{logoutMessage}</p>
                </div>
            )}

            <p>Register</p>
            <Register />

            <h2>My Watchlist</h2>
            <ul>
                {watchlist.map((anime) => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                        <li>
                            <h3>{anime.title}</h3>
                            <LazyLoad height={200} offset={100} once>
                                <img src={anime.image_url} alt={anime.title} />
                            </LazyLoad>
                        </li>
                    </Link>
                ))}
            </ul>

            <h2>My Watched List</h2>
            <ul>
                {watchedlist.map(
                    (anime) => (
                        <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                            <li>
                                <h3>{anime.title}</h3>
                                <LazyLoad height={200} offset={100} once>
                                    <img src={anime.image_url} alt={anime.title} />
                                </LazyLoad>
                            </li>
                        </Link>
                    )
                )}
            </ul>





        </>
    )
}

export default Profilepage