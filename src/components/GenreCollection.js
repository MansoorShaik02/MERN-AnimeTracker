import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const GenreCollection = () => {


    const [genrelist, setGenreList] = useState([]);


    useEffect(() => {




        const fetchGenreList = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/genres/anime');
                setGenreList(response.data.data);
            } catch (error) {
                console.error('Error fetching currently airing anime:', error);
            }
        };

        fetchGenreList();
    }, []);
    return (
        <>
            <div>GenreCollection</div>
            {genrelist.map(genre => (
                <li key={genre.mal_id}>
                    <Link to={`/genre/${genre.mal_id}`}>{genre.name}</Link>
                </li>
            ))}
        </>
    )
}

export default GenreCollection