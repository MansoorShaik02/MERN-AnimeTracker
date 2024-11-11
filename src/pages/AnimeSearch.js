import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AnimeSearch.css'; // Adjust the path if needed
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

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

    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        if (page > 1 && !loading) {
            fetchAnime();
        }
    }, [page]);

    useEffect(() => {
        // Optional: Fetch initial data if there's an initial search term
        if (searchTerm) {
            fetchAnime(true);
        }
    }, []);

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

            {loading ? <ClipLoader color="#36d7b7" size={50} /> : (

                <div className="similar-anime-container">
                    <ul className="similar-anime-list">
                        {animeList.map((anime) => (
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
                        ))}
                    </ul>
                </div>
            )}


            {/* {hasMore && !loading && (
                <div className="load-more-container">
                    <button className="load-more-button" onClick={loadMore}>Load More</button>
                </div>
            )} */}
        </div>
    );
};

export default AnimeSearch;
