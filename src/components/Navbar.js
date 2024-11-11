import React from 'react'

import "../styles/Navbar.css"
import { NavLink } from 'react-router-dom';
// Ensure the path is correct
import { useAuth } from '../context/AuthContext'
const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
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
                <li>
                    <NavLink to='/profile' activeClassName="active">Profile</NavLink>
                </li>
                {/* {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to='/userlists'> My lists</NavLink>
                            <NavLink><button onClick={logout}>Logout</button></NavLink>
                        </li>

                    </>
                ) : (
                    <NavLink exact to="/" activeClassName="active">Home</NavLink>
                )
                } */}

            </ul>
        </nav>
    );
}

export default Navbar;


