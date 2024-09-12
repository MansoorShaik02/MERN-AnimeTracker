import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Animecard from './Animecard';
import { Link } from 'react-router-dom';
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
        <div>
            <h1>Similar Anime</h1>
            {loading && <p>Loading...</p>}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {similarAnime.length > 0 ? (
                    similarAnime.slice(0, 8).map((anime) => (


                        <Link to={`/anime/${anime.entry.mal_id}`} onClick={scrollToTop}  >

                            <Animecard
                                key={anime.entry.mal_id}
                                id={anime.entry.mal_id}
                                title={anime.entry.title}
                                src={anime.entry.images.jpg.image_url}
                            />
                        </Link>
                        /* 
                                                <li key={anime.entry.mal_id} style={{ marginBottom: '20px' }}>
                                                    <img
                                                        src={anime.entry.images.jpg.image_url}
                                                        alt={anime.entry.title}
                                                        style={{ width: '150px', marginRight: '10px' }}
                                                    />
                                                    <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                                        <h3>{anime.entry.title}</h3>
                                                        <p><strong>Recommended By:</strong> {anime.recommendation_count} users</p>
                                                    </div>
                                                </li> */
                    ))
                ) : (
                    <p>No similar anime found.</p>
                )}
            </ul>
        </div>
    );
};

export default SimilarAnime;
