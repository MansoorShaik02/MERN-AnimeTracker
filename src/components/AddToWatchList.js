import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);

    const fetchWatchlist = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/watchlist?token=${token}`);
            setWatchlist(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    return (
        <div>
            <h1>Your Watchlist</h1>
            <ul>
                {watchlist.map((anime, index) => (
                    <li key={index}>{anime.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Watchlist;
