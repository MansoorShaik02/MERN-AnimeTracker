import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../styles/AnimeSearch.css'; // Adjust the path if needed
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom';

const AnimeSearch = () => {
    const [animeList, setAnimeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const fetchAnime = async (reset = false) => {
        try {
            setLoading(true);
            const response = await axios.get('https://api.jikan.moe/v4/anime', {
                params: {
                    q: searchTerm,
                    page: reset ? 1 : page,
                },
            });

            const newAnimeList = response.data.data;

            setAnimeList((prevAnimeList) => reset ? newAnimeList : [...prevAnimeList, ...newAnimeList]);
            setPage((prevPage) => reset ? 2 : prevPage + 1);

            if (newAnimeList.length === 0 || newAnimeList.length < 25) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching anime:', error);
            setHasMore(false);
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scroll to top
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setAnimeList([]);
        setPage(1);
        setHasMore(true);
        setSearchPerformed(true);  // Set search performed to true
        fetchAnime(true); // Reset the anime list on new search
    };

    useEffect(() => {
        if (page > 1 && !loading) {
            fetchAnime();
        }
    }, [page]);

    return (
        <div className="big-container">
            <div className="search-container">
                <form onSubmit={handleSearch}>
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search Anime"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button" type="submit">Search</button>
                </form>
            </div>

            {searchPerformed && (
                <InfiniteScroll
                    dataLength={animeList.length}
                    next={() => setPage((prevPage) => prevPage + 1)}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p>No more results</p>}
                >
                    <div className="similar-anime-container">
                        <ul className="similar-anime-list">
                            {animeList.map((anime) => (
                                <li key={anime.mal_id} className="similar-anime-item">
                                    <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.images.jpg.image_url}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default AnimeSearch;
