import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Ensure you create and link the CSS file
import Animecard from '../components/Animecard'
const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('');
    const [popularAnime, setPopularAnime] = useState([]);
    const [upcoming, setUpcoming] = useState([])
    const [loading, setLoading] = useState(false);
    const [AiringToday, setAiringToday] = useState([])
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


        const fetchAnimeReleasingToday = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/schedules');
                const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
                const todayAnime = response.data[today] || [];
                setAiringToday(response.data.data.slice(0, 10));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching today airing anime:', err);
            }
        };

        fetchAnimeReleasingToday();

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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scroll to top
        });
    };

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
        <div classname='actualhomepage'>
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

                <div className="similar-anime-container">
                    <h1> Anime Popular Right now</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {popularAnime.length > 0 ? (
                            popularAnime.slice(0, 10).map((anime) => (
                                <li key={anime.mal_id} className="similar-anime-item">
                                    <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.images.jpg.image_url}
                                        />
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p>No popular anime found.</p>
                        )}
                    </ul>
                </div>

                <div className="similar-anime-container">
                    <h1>Upcoming Anime</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {upcoming.length > 0 ? (
                            upcoming.slice(0, 10).map((anime) => (
                                <li key={anime.mal_id} className="similar-anime-item">
                                    <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.images.jpg.image_url}
                                        />
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p>No upcoming anime found.</p>
                        )}
                    </ul>
                </div>


                <div className="similar-anime-container">
                    <h1>Anime Airing Today</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {AiringToday.length > 0 ? (
                            AiringToday.slice(0, 10).map((anime) => (
                                <li key={anime.mal_id} className="similar-anime-item">
                                    <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                        <Animecard
                                            id={anime.mal_id}
                                            title={anime.title}
                                            src={anime.images.jpg.image_url}
                                        />
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p>No Airing Today anime found.</p>
                        )}
                    </ul>
                </div>

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

            <div className='Genre'> Genre</div>
        </div>
    );
};

export default Homepage;
