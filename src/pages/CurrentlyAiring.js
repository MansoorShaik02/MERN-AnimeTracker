import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Animecard from '../components/Animecard'; // Import your Animecard component
import 'D:/reactproectsreal/AnimeList/src/styles/CurrentlyAiring.css' // Adjust the path if needed
// Optional: Create this file for styling
import { Link } from 'react-router-dom';

const CurrentlyAiring = () => {


    const [animeList, setAnimeList] = useState([]);

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
                    <Link to={`/anime/${anime.mal_id}`}>

                        <Animecard
                            key={anime.mal_id}
                            id={anime.mal_id}
                            title={anime.title}
                            src={anime.images.jpg.image_url}
                        />
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default CurrentlyAiring;
