import React, { useEffect } from 'react';

const Aniwatchapi = () => {
    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const resp = await fetch(
                    "https://aniwatch-api-v1-0.onrender.com/api/server/ep=3662"
                );
                const data = await resp.json();
                console.log(data); // Log the data to the console
            } catch (error) {
                console.error('Error fetching anime:', error);
            }
        };

        fetchAnime(); // Call the function to fetch data
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div>
            <h1>Search Results for "Your Name"</h1>
            {/* You can render the data here after logging and verifying it */}
        </div>
    );
};

export default Aniwatchapi;
