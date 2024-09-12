import React from 'react'
import "D:/reactproectsreal/animelist/src/styles/Animecard.css"
const Animecard = (props) => {
    return (
        <li className="anime-card" key={props.id}>
            <h3>{props.title}</h3>
            <img src={props.src} alt={props.title} />
        </li>
    )
}

export default Animecard