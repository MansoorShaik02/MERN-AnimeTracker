import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Animecard from './Animecard';
import { Link } from 'react-router-dom';
import "../styles/SimilarAnime.css";
// Import the CSS file

const SimilarAnime = ({ animeId }) => {
    const [similarAnime, setSimilarAnime] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSimilarAnime = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);

                if (response.data && response.data.data) {
                    setSimilarAnime(response.data.data);
                } else {
                    setSimilarAnime([]);  // Fallback to empty array if no data
                }

            } catch (error) {
                console.error('Error fetching similar anime:', error);
                setSimilarAnime([]);  // Set to empty array in case of error
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarAnime();
    }, [animeId]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scroll to top
        });
    };

    return (
        <div className="similar-anime-container">
            <h1>Similar Anime</h1>
            {loading && <p>Loading...</p>}
            <ul className="similar-anime-list">
                {similarAnime.length > 0 ? (
                    similarAnime.slice(0, 8).map((anime) => (
                        <li key={anime.entry.mal_id} className="similar-anime-item">
                            <Link to={`/anime/${anime.entry.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                <Animecard
                                    id={anime.entry.mal_id}
                                    title={anime.entry.title}
                                    src={anime.entry.images.jpg.image_url}
                                />
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No similar anime found.</p>
                )}
            </ul>
        </div>
    );
};

export default SimilarAnime;
