import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Ensure you create and link the CSS file

const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('');
    const [popularAnime, setPopularAnime] = useState([]);
    const [upcoming, setUpcoming] = useState([])

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

        const fetchupcomingAnime = async () => {
            try {

                const upcoming = await axios.get('https://api.jikan.moe/v4/seasons/upcoming')
                setUpcoming(upcoming.data.data.slice(0, 10)); // Get top 10 popular animes
            } catch (error) {
                console.error('Error fetching popular anime:', error);
            }
        };

        fetchupcomingAnime();
    }, []);

    const handleLogin = (status) => {
        setIsAuthenticated(status);
        setLogoutMessage('');
    };

    const handleLogout = () => {
        const token = localStorage.getItem('token');

        if (token) {
            localStorage.removeItem('token');
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

            {/* Top 10 Popular Anime List */}
            <section className="popular-anime-list">
                <h2>Popular Anime Right Now</h2>
                <div className="anime-list">
                    {popularAnime.map(anime => (
                        <Link style={{ textDecoration: 'none' }} to={`/anime/${anime.mal_id}`} key={anime.mal_id}>

                            <div key={anime.mal_id} className="anime-card">
                                <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-image" />
                                <h3>{anime.title}</h3>
                                <p>Rating: {anime.score}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="popular-anime-list">
                <h2>Upcoming Anime</h2>
                <div className="anime-list">
                    {upcoming.map(anime => (
                        <Link style={{ textDecoration: 'none' }} to={`/anime/${anime.mal_id}`} key={anime.mal_id}>

                            <div key={anime.mal_id} className="anime-card">
                                <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-image" />
                                <h3>{anime.title}</h3>

                            </div>
                        </Link>
                    ))}
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
            </section>

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
