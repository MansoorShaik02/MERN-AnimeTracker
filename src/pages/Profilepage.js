import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Login from "../components/Login";
import Register from "../components/Register";
import LazyLoad from 'react-lazyload';

import { Link } from "react-router-dom";
import '../styles/Profilepage.css'; // Adjust the path if needed

const Profilepage = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [watchedlist, setWatchedlist] = useState([]);
    const [droppedlist, setDroppedlist] = useState([]);
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

                setWatchlist(response.data.watchlist || []);
                setWatchedlist(response.data.watchedlist || []);
                setDroppedlist(response.data.droplist || []);

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

    const handleDelete = async (animeId) => {
        try {
            const token = localStorage.getItem('token');

            // Determine which list the anime is in
            let listType = '';
            if (watchlist.some(anime => anime.mal_id === animeId)) {
                listType = 'watchlist';
            } else if (watchedlist.some(anime => anime.mal_id === animeId)) {
                listType = 'watchedlist';
            } else if (droppedlist.some(anime => anime.mal_id === animeId)) {
                listType = 'droplist';
            }
            console.log(listType)
            if (listType) {
                const response = await axios.delete(`http://localhost:5000/api/users/${listType}/${animeId}`, {
                    headers: { 'x-auth-token': token }


                }
                    , console.log("Identified list type"));

                if (response.status === 200) {
                    if (listType === 'watchlist') {
                        setWatchlist(watchlist.filter(anime => anime.mal_id !== animeId));
                        console.log("watchlist this is")
                    } else if (listType === 'watchedlist') {
                        setWatchedlist(watchedlist.filter(anime => anime.mal_id !== animeId));
                        console.log("watchedlist this is")
                    } else if (listType === 'droplist') {
                        setDroppedlist(droppedlist.filter(anime => anime.mal_id !== animeId));
                        console.log("dropped this is")
                    }
                    else {
                        console.log("no list found")
                    }
                } else {
                    console.error('Error deleting anime from list:', response.data);
                }
            } else {
                console.error('Anime not found in any list');
            }
        } catch (err) {
            console.error('Error deleting anime from list:', err);
        }
    };

    return (
        <div className="profile-page">
            <h2>Your Profile</h2>
            {!isAuthenticated ? (
                <div>
                    <Login />
                    <Register />
                </div>
            ) : (
                <>
                    <div>
                        <button onClick={logout}>Logout</button>
                        <div>
                            <h3>Username: {userInfo.username}</h3>
                            <h3>Email: {userInfo.email}</h3>
                        </div>
                        <div className="user-statistics">
                            <h3>User Statistics</h3>
                            <ul>
                                <li>Total Watched Anime: {watchedlist.length}</li>
                                <li>Watchlist Anime: {watchlist.length}</li>
                                <li>Dropped Anime: {droppedlist.length}</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Watchlist</h3>
                            <ul>
                                {watchlist.map((anime) => (
                                    <li key={anime.mal_id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <h3>{anime.title}</h3>
                                        </Link>
                                        <LazyLoad height={200} offset={100} once>
                                            <img src={anime.image_url} alt={anime.title} />
                                        </LazyLoad>
                                        <button onClick={() => handleDelete(anime.mal_id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Watched List</h3>
                            <ul>
                                {watchedlist.map((anime) => (
                                    <li key={anime.mal_id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <h3>{anime.title}</h3>
                                        </Link>
                                        <LazyLoad height={200} offset={100} once>
                                            <img src={anime.image_url} alt={anime.title} />
                                        </LazyLoad>
                                        <button onClick={() => handleDelete(anime.mal_id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Dropped List</h3>
                            <ul>
                                {droppedlist.map((anime) => (
                                    <li key={anime.mal_id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <h3>{anime.title}</h3>
                                        </Link>
                                        <LazyLoad height={200} offset={100} once>
                                            <img src={anime.image_url} alt={anime.title} />
                                        </LazyLoad>
                                        <button onClick={() => handleDelete(anime.mal_id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profilepage;
