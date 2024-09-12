import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Ensure you create and link the CSS file
import GenreCollection from '../components/GenreCollection';
import Login from '../components/Login';
import Register from '../components/Register';

const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(''); // State to control the logout message

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            console.log('JWT token exists:', token);
            setIsAuthenticated(true);
        } else {
            console.log('No JWT token found in localStorage');
        }
    }, []);

    const handleLogin = (status) => {
        setIsAuthenticated(status);
        setLogoutMessage(''); // Clear logout message when logged in
    };

    const handleLogout = () => {
        const token = localStorage.getItem('token');

        if (token) {
            localStorage.removeItem('token'); // Remove token from localStorage
            setIsAuthenticated(false);
            setLogoutMessage('You have been logged out successfully.');
            console.log("logged out");
        } else {
            setLogoutMessage('Login first to log out.');
            console.log('No JWT token found in localStorage');
        }
    };

    return (
        <div className="homepage">
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <p>You are logged in!</p>
            )}
            <button onClick={handleLogout}>Logout</button>

            {logoutMessage && (
                <div className="logout-message">
                    <p>{logoutMessage}</p>
                </div>
            )}

            <p>Register</p>
            <Register />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Anime World</h1>
                    <p>Your one-stop destination for discovering the best anime!</p>
                    <Link to="/search" className="cta-button">Search Anime</Link>
                </div>
            </section>

            {/* Featured Sections */}
            <section className="featured-sections">
                <div className="featured-section">
                    <h2>Currently Airing Anime</h2>
                    <Link to="/currentlyAiring" className="section-link">Explore Now</Link>
                </div>
                <div className="featured-section">
                    <h2>Trending Anime</h2>
                    <Link to="/trending" className="section-link">See What's Hot</Link>
                </div>
                <div className="featured-section">
                    <h2>Popular Anime</h2>
                    <Link to="/popular" className="section-link">Discover More</Link>
                </div>
            </section>

            <GenreCollection />

            {/* Footer */}
            <footer className="footer">
                <p>© 2024 Anime World. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/trending">Trending</Link>
                    <Link to="/currentlyAiring">Currently Airing</Link>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
