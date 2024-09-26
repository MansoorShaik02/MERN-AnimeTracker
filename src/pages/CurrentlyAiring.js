// src/components/CurrentlyAiring.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/CurrentlyAiring.css';

const CurrentlyAiring = () => {
    const [animeList, setAnimeList] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchCurrentlyAiringAnime = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
                setAnimeList(response.data.data);
            } catch (error) {
                console.error('Error fetching currently airing anime:', error);
            }
        };
        fetchCurrentlyAiringAnime();
    }, []);

    return (
        <div className="currently-airing">
            <h1>Currently Airing Anime</h1>
            <ul className="anime-list">
                {animeList.map(anime => (
                    <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                        <Animecard
                            id={anime.mal_id}
                            title={anime.title}
                            src={anime.images.jpg.image_url}
                        />
                    </Link>
                ))}
            </ul>
            {!isAuthenticated && <p>Please log in to add to your watchlist or watched list.</p>}
        </div>
    );
};

export default CurrentlyAiring;
