import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import LazyLoad from 'react-lazyload';
import 'D:/reactproectsreal/AnimeList/src/styles/Trending.css'; // Adjust the path if needed
import { Link } from 'react-router-dom';

const Trending = () => {
    const [trendingAnime, setTrendingAnime] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

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

    useEffect(() => {
        fetchTrendingAnime();
    }, []);

    return (
        <div className="trending-container">
            <h2>Trending Anime</h2>

            <InfiniteScroll
                dataLength={trendingAnime.length}
                next={() => fetchTrendingAnime()}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more trending anime</p>}
            >
                <ul className="anime-list">
                    {trendingAnime.map((anime) => (
                        <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                            <li>
                                <h3>{anime.title}</h3>
                                <LazyLoad height={200} offset={100} once>
                                    <img src={anime.images.jpg.image_url} alt={anime.title} />
                                </LazyLoad>
                            </li>
                        </Link>
                    ))}
                </ul>
            </InfiniteScroll>
        </div>
    );
};

export default Trending;
