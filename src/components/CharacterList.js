import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/CharacterList.css"
// Import the CSS file
import { Link } from 'react-router-dom'

const CharacterList = ({ animeId }) => {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
                setCharacters(response.data.data);
            } catch (error) {
                console.error('Error fetching character list:', error);
            }
        };

        fetchCharacters();
    }, [animeId]);

    return (
        <div className="character-list">
            {characters.slice(0, 8).map((character) => (
                <div className="character-card" key={character.character.mal_id}>
                    <Link to={`/character/${character.character.mal_id}`} key={character.character.mal_id}>
                        <img src={character.character.images.jpg.image_url} alt={character.character.name} />
                        <h3>{character.character.name}</h3>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default CharacterList;
