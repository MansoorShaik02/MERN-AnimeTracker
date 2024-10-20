// src/components/AnimeDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SimilarAnime from '../components/SimilarAnime';
import CharacterList from '../components/CharacterList';
import AnimeTrailer from '../components/AnimeTrailer';
import { useAuth } from '../context/AuthContext';
import '../styles/AnimeDetails.css' // Adjust the path if needed

// Import the CSS file

const AnimeDetails = () => {
    const { isAuthenticated } = useAuth();
    const { id } = useParams();
    const [animeDetails, setAnimeDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
                setAnimeDetails(response.data.data);
            } catch (error) {
                console.error('Error fetching anime details:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/comments/${id}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchAnimeDetails();
        fetchComments();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('You must be logged in to add a comment');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/users/comments',
                { animeId: id, text: commentText },
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            setComments([...comments, response.data]);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleAddToWatchlist = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to add to watchlist');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Please log in first.');
                return;
            }

            const animeData = {
                mal_id: animeDetails.mal_id,
                title: animeDetails.title,
                image_url: animeDetails.images.jpg.image_url,
            };

            await axios.post('http://localhost:5000/api/users/watchlist', animeData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setMessage('Added to Watchlist!');
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            setMessage('Failed to add to watchlist.');
        }
    };
    // add to drop list

    const handleAddToDroplist = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to add to droplistt');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Please log in first.');
                return;
            }

            const animeData = {
                mal_id: animeDetails.mal_id,
                title: animeDetails.title,
                image_url: animeDetails.images.jpg.image_url,
            };

            await axios.post('http://localhost:5000/api/users/droplist', animeData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setMessage('Added to droplist!');
        } catch (error) {
            console.error('Error adding to droplist:', error);
            setMessage('Failed to add to droplist.');
        }
    };

    // aaa
    const handleAddToWatchedlist = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to add to watched list');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Please log in first.');
                return;
            }

            const animeData = {
                mal_id: animeDetails.mal_id,
                title: animeDetails.title,
                image_url: animeDetails.images.jpg.image_url,
            };

            await axios.post('http://localhost:5000/api/users/watchedlist', animeData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setMessage('Added to Watched List!');
        } catch (error) {
            console.error('Error adding to watched list:', error);
            setMessage('Failed to add to watched list.');
        }
    };

    if (!animeDetails) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <div className="anime-details">
                <h1>{animeDetails.title}</h1>
                <img src={animeDetails.images.jpg.image_url} alt={animeDetails.title} />
                <p><strong>Rating:</strong> {animeDetails.score}</p>
                <p><strong>Episodes:</strong> {animeDetails.episodes}</p>
                <p><strong>Status:</strong> {animeDetails.status}</p>
                <p><strong>Synopsis:</strong> {animeDetails.synopsis}</p>

                <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
                <button onClick={handleAddToWatchedlist}>Add to Watched List</button>
                <button onClick={handleAddToDroplist}>Add to Drop List</button>
                {message && <p>{message}</p>}
            </div>

            <AnimeTrailer />
            <CharacterList animeId={id} />
            <SimilarAnime animeId={id} />
        </>
    );
};

export default AnimeDetails;
