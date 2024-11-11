import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';
import 'D:/reactproectsreal/MERNAnimeDB/MERN-AnimeTracker/src/styles/Trending.css'; // Adjust the path if needed
import { Link } from 'react-router-dom';
import Animecard from '../components/Animecard';

const Trending = () => {
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);














    const fetchTrendingAnime = async () => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/top/anime`, {
                params: {
                    page: page,
                },
            });

            const newAnimeList = response.data.data;

            setTrendingAnime((prevAnime) => [...prevAnime, ...newAnimeList]);
            setPage((prevPage) => prevPage + 1);

            if (newAnimeList.length === 0 || newAnimeList.length < 25) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching trending anime:', error);
            setHasMore(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scroll to top
        });
    }
    useEffect(() => {
        fetchTrendingAnime();
    }, []);

    return (



        <div className="similar-anime-container">
            <h1> Anime Trending Right now</h1>
            {loading && <p>Loading...</p>}
            <ul className="similar-anime-list">
                {trendingAnime.length > 0 ? (
                    trendingAnime.slice(0, 20).map((anime) => (
                        <li key={anime.mal_id} className="similar-anime-item">
                            <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                <Animecard
                                    id={anime.mal_id}
                                    title={anime.title}
                                    src={anime.images.jpg.image_url}
                                    description={anime.synopsis}
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

export default Trending;
