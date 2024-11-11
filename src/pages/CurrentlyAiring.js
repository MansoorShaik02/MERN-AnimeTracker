// src/components/CurrentlyAiring.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/CurrentlyAiring.css';
import './HomePage.css';
import ClipLoader from 'react-spinners/ClipLoader';

const CurrentlyAiring = () => {
    const [animeList, setAnimeList] = useState([]);
    const { isAuthenticated } = useAuth();
    const [loadigAiring, setLoadingAiring] = useState(false);


    useEffect(() => {
        const fetchCurrentlyAiringAnime = async () => {
            setLoadingAiring(true)
            try {
                const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
                setAnimeList(response.data.data);
            } catch (error) {
                console.error('Error fetching currently airing anime:', error);
            } finally {
                setLoadingAiring(false)
            }
        };
        fetchCurrentlyAiringAnime();
    }, []);

    return (
        <div className="similar-anime-container">
            <h1>Currently Airing Anime</h1>

            {loadigAiring ? <ClipLoader color="#36d7b7" size={50} /> : (

                <ul className="similar-anime-list">
                    {animeList.map(anime => (
                        <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                            <Animecard
                                id={anime.mal_id}
                                title={anime.title}
                                src={anime.images.jpg.image_url}
                                description={anime.synopsis}
                            />
                        </Link>
                    ))}
                </ul>

            )}









            {/* real */}


        </div>
    );
};

export default CurrentlyAiring;
