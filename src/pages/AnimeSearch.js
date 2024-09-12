import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'D:/reactproectsreal/AnimeList/src/styles/AnimeSearch.css' // Adjust the path if needed
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom';
const AnimeSearch = () => {
    const [animeList, setAnimeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAnime = async () => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
                params: {
                    q: searchTerm,
                    page: page,
                },
            });

            const newAnimeList = response.data.data;

            setAnimeList((prevAnimeList) => [...prevAnimeList, ...newAnimeList]);
            setPage((prevPage) => prevPage + 1);

            if (newAnimeList.length === 0 || newAnimeList.length < 25) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching anime:', error);
            setHasMore(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setAnimeList([]);
        setPage(1);
        setHasMore(true);
        fetchAnime();
    };

    useEffect(() => {
        if (page > 1) {
            fetchAnime();
        }
    }, [page]);

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search Anime"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <InfiniteScroll
                dataLength={animeList.length}
                next={() => setPage((prevPage) => prevPage + 1)}
                hasMore={hasMore}
                loader={<h4>Search for an anime</h4>}
                endMessage={<p>No more results</p>}
            >
                <ul>
                    {animeList.map((anime) => (
                        <Link to={`/anime/${anime.mal_id}`}>

                            <Animecard id={anime.mal_id} title={anime.title} src={anime.images.jpg.image_url} />
                        </Link>
                    ))}
                </ul>
            </InfiniteScroll>
        </div>
    );
};

export default AnimeSearch;
