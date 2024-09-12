import React from 'react'

import "D:/reactproectsreal/animelist/src/styles/Navbar.css"
import { NavLink } from 'react-router-dom';
// Ensure the path is correct

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink exact to="/" activeClassName="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/search" activeClassName="active">Search Anime</NavLink>
                </li>
                <li>
                    <NavLink to="/trending" activeClassName="active">Trending</NavLink>
                </li>
                <li>
                    <NavLink to='/currentlyAiring' activeClassName="active">Currently Airing</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;


