import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SimilarAnime from '../components/SimilarAnime';
import CharacterList from '../components/CharacterList';
import AnimeTrailer from '../components/AnimeTrailer';
import { useAuth } from '../context/AuthContext';
import '../styles/AnimeDetails.css'; // Adjust the path if needed

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

    const handleAddToList = async (listType) => {
        if (!isAuthenticated) {
            alert(`You must be logged in to add to ${listType}`);
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

            await axios.post(`http://localhost:5000/api/users/${listType}`, animeData, {
                headers: {
                    'x-auth-token': token,
                },
            });

            setMessage(`Added to ${listType.replace('list', ' List')}!`);
        } catch (error) {
            console.error(`Error adding to ${listType}:`, error);
            setMessage(`Failed to add to ${listType}.`);
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

                <div className="button-container">
                    <button onClick={() => handleAddToList('watchlist')}>Add to Watchlist</button>
                    <button onClick={() => handleAddToList('watchedlist')}>Add to Watched List</button>
                    <button onClick={() => handleAddToList('droplist')}>Add to Drop List</button>
                </div>
                {message && <p>{message}</p>}
            </div>

            <AnimeTrailer />
            <CharacterList animeId={id} />
            <div className="comments-section">
                <h2>Comments</h2>
                {comments.map(comment => (
                    <div key={comment._id}>
                        <p><strong>{comment.user?.username || "[Deleted Profile]"}:</strong> {comment.text}</p>
                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                ))}
                {isAuthenticated && (
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment"
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                )}
            </div>
            <SimilarAnime animeId={id} />
        </>
    );
};

export default AnimeDetails;
