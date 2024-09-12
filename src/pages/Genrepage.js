import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Animecard from '../components/Animecard';
import { Link } from 'react-router-dom'
function Genrepage() {
    const { genreId } = useParams();
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}`)
            .then(response => response.json())
            .then(data => setAnimeList(data.data))
            .catch(error => console.error('Error fetching anime:', error));
    }, [genreId]);

    return (
        <div>
            <h1>Anime List</h1>
            <ul>
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
}

export default Genrepage;
