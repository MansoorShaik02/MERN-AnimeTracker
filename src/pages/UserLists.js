// src/pages/UserLists.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserLists = () => {
    const { isAuthenticated } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [watchedlist, setWatchedlist] = useState([]);
    const [loading, setLoading] = useState(true);

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
        return <p>You need to log in to view your lists.</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>My Watchlist</h2>
            <ul>
                {watchlist.map(anime => (
                    <li key={anime._id}>
                        <img src={anime.image_url} alt={anime.title} />
                        <p>{anime.title}</p>
                    </li>
                ))}
            </ul>

            <h2>My Watched List</h2>
            <ul>
                {watchedlist.map(anime => (
                    <li key={anime._id}>
                        <img src={anime.image_url} alt={anime.title} />
                        <p>{anime.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserLists;
