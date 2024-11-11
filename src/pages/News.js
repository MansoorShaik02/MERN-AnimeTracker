import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~');
                const data = response.data;
                // Parse the XML data
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'application/xml');
                const items = xml.getElementsByTagName('item');
                const newsArray = [];

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const title = item.getElementsByTagName('title')[0].textContent;
                    const link = item.getElementsByTagName('link')[0].textContent;
                    const description = item.getElementsByTagName('description')[0].textContent;

                    newsArray.push({
                        title,
                        link,
                        description,
                    });
                }

                setNews(newsArray);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Anime News</h1>
            aaa
            <ul>
                {news.map((item, index) => (
                    <li key={index}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            Read more
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
