import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// Optional: Create this file for styling

const AnimeTrailer = () => {
    const { id } = useParams(); // Get the anime ID from the URL
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
                setAnime(response.data.data); // Assuming the API response contains a "data" object
            } catch (error) {
                console.error('Error fetching anime details:', error);
            }
        };

        fetchAnimeDetails();
    }, [id]);

    if (!anime) {
        return <p>Loading anime details...</p>;
    }

    return (
        <div className="anime-details">

            {anime.trailer && anime.trailer.url && (
                <div className="trailer">
                    <h2>Trailer</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={anime.trailer.embed_url}
                        title={`${anime.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
            <p>{anime.synopsis}</p>
            {/* Add more anime details here */}
        </div>
    );
};

export default AnimeTrailer;
