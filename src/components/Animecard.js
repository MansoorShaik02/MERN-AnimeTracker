import React from 'react';
import "D:/reactproectsreal/MERNAnimeDB/MERN-AnimeTracker/src/styles/Animecard.css";

const Animecard = (props) => {
    return (
        <li className="anime-card" key={props.id}>
            <img src={props.src} alt={props.title} />
            <h3>{props.title}</h3>
        </li>
    );
};

export default Animecard;
