// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Login from "../components/Login";
import Register from "../components/Register";
import LazyLoad from 'react-lazyload';
import { Link } from "react-router-dom";
import 'D:/reactproectsreal/MERNAnimeDB/MERN-AnimeTracker/src/styles/Profilepage.css';
import Animecard from '../components/Animecard';

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

                console.log('Response Data:', response.data); // Debugging: Log the response data

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
                    <div className='similar-anime-container'>
                        <button onClick={logout}>Logout</button>
                        <div>
                            <h3>Username: {userInfo.username}</h3>
                            <h3>Email: {userInfo.email}</h3>
                        </div>
                        <div>
                            <h3>Watchlist</h3>
                            <ul className='similar-anime-list '>
                                {watchlist.map((anime) => (
                                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.image_url}
                                        />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Watched List</h3>
                            <ul className='similar-anime-list'>
                                {watchedlist.map((anime) => (
                                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.image_url}
                                        />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Dropped List</h3>
                            <ul className='similar-anime-list'>
                                {droppedlist.map((anime) => (
                                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.image_url}
                                        />
                                    </Link>
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
