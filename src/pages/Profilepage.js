import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import Register from '../components/Register';
import { Link } from 'react-router-dom';
import Animecard from '../components/Animecard';
import '../styles/Profilepage.css';

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

    const deleteAnime = async (listType, animeId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/list/${listType}/${animeId}`, {
                headers: { 'x-auth-token': token }
            });

            if (listType === 'watchlist') {
                setWatchlist(prevList => prevList.filter(anime => anime._id !== animeId));
            } else if (listType === 'watchedlist') {
                setWatchedlist(prevList => prevList.filter(anime => anime._id !== animeId));
            } else if (listType === 'droplist') {
                setDroppedlist(prevList => prevList.filter(anime => anime._id !== animeId));
            }
        } catch (err) {
            console.error('Error deleting anime from list:', err);
        }
    };

    return (
        <div className="profile-page">
            <h2>Your Profile</h2>
            {!isAuthenticated ? (
                <div className='usercomponent'>
                    <h2>Login</h2>
                    <Login />
                    <h2>Register</h2>
                    <Register />
                </div>
            ) : (
                <>
                    <div className='similar-anime-container'>
                        <button onClick={logout}>Logout</button>
                        <div>
                            <div className='profile-stats'>
                                <div>
                                    <h3>Username: {userInfo.username}</h3>
                                </div>
                                <div>
                                    <h3>Watchlist Count: {watchlist.length}</h3>
                                </div>
                                <div>
                                    <h3>Watched List Count: {watchedlist.length}</h3>
                                </div>
                                <div>
                                    <h3>Dropped List Count: {droppedlist.length}</h3>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3>Watchlist</h3>
                            <ul className='similar-anime-list'>
                                {watchlist.map((anime) => (
                                    <div key={anime._id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <Animecard
                                                id={anime.mal_id}
                                                title={anime.title}
                                                src={anime.image_url}
                                            />
                                        </Link>
                                        <button onClick={() => deleteAnime('watchlist', anime._id)}>Delete</button>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Watched List</h3>
                            <ul className='similar-anime-list'>
                                {watchedlist.map((anime) => (
                                    <div key={anime._id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <Animecard
                                                id={anime.mal_id}
                                                title={anime.title}
                                                src={anime.image_url}
                                            />
                                        </Link>
                                        <button onClick={() => deleteAnime('watchedlist', anime._id)}>Delete</button>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3>Dropped List</h3>
                            <ul className='similar-anime-list'>
                                {droppedlist.map((anime) => (
                                    <div key={anime._id}>
                                        <Link to={`/anime/${anime.mal_id}`}>
                                            <Animecard
                                                id={anime.mal_id}
                                                title={anime.title}
                                                src={anime.image_url}
                                            />
                                        </Link>
                                        <button onClick={() => deleteAnime('droplist', anime._id)}>Delete</button>
                                    </div>
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
