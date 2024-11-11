import React from 'react';
import "../styles/Animecard.css";

const Animecard = (props) => {
    return (
        <div className="main-container">
            <div className="poster-container">
                <img src={props.src} className="poster" alt={props.title} />
            </div>
            <div className="ticket-container">
                <div className="ticket__content">
                    <h4 className="ticket__movie-title">{props.title}</h4>
                    <p className="ticket__movie-description">{props.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Animecard;
