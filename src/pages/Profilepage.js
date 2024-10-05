// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Login from "../components/Login";
import Register from "../components/Register";
import LazyLoad from 'react-lazyload';
import { Link } from "react-router-dom";
import 'D:/reactproectsreal/MERNAnimeDB/MERN-AnimeTracker/src/styles/Profilepage.css'

const Profilepage = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [watchedlist, setWatchedlist] = useState([]);
    const { isAuthenticated, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchUserLists = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/userlists', {
                    headers: { 'x-auth-token': token }
                });
                setWatchlist(response.data.watchlist);
                setWatchedlist(response.data.watchedlist);
                setUserInfo({ username: response.data.username, email: response.data.email });
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

    return (
        <div>
            <h2>Your Profile</h2>
            {!isAuthenticated && (
                <div>
                    <Login />
                    <Register />
                </div>
            )}
            {isAuthenticated && (
                <>
                    <div>
                        <button onClick={logout}>Logout</button>
                        <div>
                            <h3>Username: {userInfo.username}</h3>
                            <h3>Email: {userInfo.email}</h3>
                        </div>
                        <h3>Watchlist</h3>
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
                    </div>
                    <div>
                        <h3>Watched List</h3>
                        <ul>
                            {watchedlist.map((anime) => (
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
                    </div>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </div>
    );
};

export default Profilepage;
