import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Ensure you create and link the CSS file
import Animecard from '../components/Animecard';
import StaticGenres from '../helpers/StaticGenres';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('');
    const [popularAnime, setPopularAnime] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(false);
    const [airingToday, setAiringToday] = useState([]);
    const [popularCurrentIndex, setPopularCurrentIndex] = useState(0);
    const [upcomingCurrentIndex, setUpcomingCurrentIndex] = useState(0);
    const [airingTodayCurrentIndex, setAiringTodayCurrentIndex] = useState(0);

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
                setPopularAnime(response.data.data.slice(0, 35)); // Get top 35 popular animes
            } catch (error) {
                console.error('Error fetching popular anime:', error);
            }
        };

        fetchPopularAnime();

        const fetchAnimeReleasingToday = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/schedules');
                const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
                setAiringToday(response.data.data.slice(0, 35));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching today airing anime:', err);
            }
        };

        fetchAnimeReleasingToday();

        const fetchUpcomingAnime = async () => {
            try {
                const response = await axios.get('https://api.jikan.moe/v4/seasons/upcoming');
                setUpcoming(response.data.data.slice(0, 35)); // Get top 35 upcoming animes
            } catch (error) {
                console.error('Error fetching upcoming anime:', error);
            }
        };

        fetchUpcomingAnime();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
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

    const handleNextPopular = () => {
        setPopularCurrentIndex((prevIndex) => Math.min(prevIndex + 7, popularAnime.length - 7));
    };

    const handlePrevPopular = () => {
        setPopularCurrentIndex((prevIndex) => Math.max(prevIndex - 7, 0));
    };

    const handleNextUpcoming = () => {
        setUpcomingCurrentIndex((prevIndex) => Math.min(prevIndex + 7, upcoming.length - 7));
    };

    const handlePrevUpcoming = () => {
        setUpcomingCurrentIndex((prevIndex) => Math.max(prevIndex - 7, 0));
    };

    const handleNextAiringToday = () => {
        setAiringTodayCurrentIndex((prevIndex) => Math.min(prevIndex + 7, airingToday.length - 7));
    };

    const handlePrevAiringToday = () => {
        setAiringTodayCurrentIndex((prevIndex) => Math.max(prevIndex - 7, 0));
    };

    return (
        <div className='actualhomepage'>
            <div className="homepage">
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to Anime World</h1>
                        <p>Your one-stop destination for discovering the best anime!</p>
                        <div className='herobuttons'>
                            <Link to="/search" className="cta-button">Search Anime</Link>
                            <StaticGenres></StaticGenres>

                        </div>

                    </div>

                </section>
                <div className="similar-anime-container">

                    <h1>Anime Popular Right Now</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {popularAnime.slice(popularCurrentIndex, popularCurrentIndex + 7).map((anime) => (
                            <li key={anime.mal_id} className="similar-anime-item">
                                <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                    <Animecard
                                        id={anime.mal_id}
                                        title={anime.title}
                                        src={anime.images.jpg.image_url}
                                        description={anime.synopsis}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="navigation-buttons">
                        <button onClick={handlePrevPopular} disabled={popularCurrentIndex === 0}><ArrowBackIcon fontSize='small' /></button>
                        <button onClick={handleNextPopular} disabled={popularCurrentIndex >= popularAnime.length - 7}><ArrowForwardIcon fontSize='small' />
                        </button>
                    </div>
                </div>
                <div className="similar-anime-container">
                    <h1>Upcoming Anime</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {upcoming.slice(upcomingCurrentIndex, upcomingCurrentIndex + 7).map((anime) => (
                            <li key={anime.mal_id} className="similar-anime-item">
                                <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                    <Animecard
                                        id={anime.mal_id}
                                        title={anime.title}
                                        src={anime.images.jpg.image_url}
                                        description={anime.synopsis}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="navigation-buttons">
                        <button onClick={handlePrevUpcoming} disabled={upcomingCurrentIndex === 0}><ArrowBackIcon /></button>
                        <button onClick={handleNextUpcoming} disabled={upcomingCurrentIndex >= upcoming.length - 7}><ArrowForwardIcon /></button>
                    </div>
                </div>
                <div className="similar-anime-container">
                    <h1>Anime Airing Today</h1>
                    {loading && <p>Loading...</p>}
                    <ul className="similar-anime-list">
                        {airingToday.slice(airingTodayCurrentIndex, airingTodayCurrentIndex + 7).map((anime) => (
                            <li key={anime.mal_id} className="similar-anime-item">
                                <Link to={`/anime/${anime.mal_id}`} onClick={scrollToTop} className="similar-anime-link">
                                    <Animecard
                                        id={anime.mal_id}
                                        title={anime.title}
                                        src={anime.images.jpg.image_url}
                                        description={anime.synopsis}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="navigation-buttons">
                        <button onClick={handlePrevAiringToday} disabled={airingTodayCurrentIndex === 0}><ArrowBackIcon /></button>
                        <button onClick={handleNextAiringToday} disabled={airingTodayCurrentIndex >= airingToday.length - 7}><ArrowForwardIcon /></button>
                    </div>
                </div>
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
        </div>
    );
};

export default Homepage;
