import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Ensure you create and link the CSS file
import GenreCollection from '../components/GenreCollection';
import Login from '../components/Login';
import Register from '../components/Register';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';

const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(''); // State to control the logout message
    const [popularAnime, setPopularAnime] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            console.log('JWT token exists:', token);
            setIsAuthenticated(true);
        } else {
            console.log('No JWT token found in localStorage');
        }

        const fetchPopularAnime = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/top/anime');
                setPopularAnime(response.data.data.slice(0, 10)); // Get top 10 popular animes
            } catch (error) {
                console.error('Error fetching popular anime:', error);
            }
        };

        fetchPopularAnime();
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


            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Anime World</h1>
                    <p>Your one-stop destination for discovering the best anime!</p>
                    <Link to="/search" className="cta-button">Search Anime</Link>
                </div>
            </section>

            {/* Carousel for Popular Anime */}

            <section className="carousel-section">
                <h2>Popular Anime</h2>
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {popularAnime.map((anime) => (
                        <div key={anime.mal_id} className="slide">
                            <Link to={`/anime/${anime.mal_id}`}>
                                <img src={anime.images.jpg.image_url} alt={anime.title} />
                                <div className="legend">
                                    <h3>{anime.title}</h3>
                                    <p>{anime.synopsis}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Carousel>
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

            {/* <GenreCollection /> */}

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
