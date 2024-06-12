const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
app.use(cors({
    origin: 'https://your-github-username.github.io',
    optionsSuccessStatus: 200
}));


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// API route
app.get('/api/videos', async (req, res) => {
    try {
        const { pageToken } = req.query;
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: 'Dakota Fanning Interview',
                type: 'video',
                key: process.env.YOUTUBE_API_KEY,
                order: 'relevance',
                maxResults: 8,
                pageToken: pageToken || ''
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching videos', error);
        res.status(500).send('Server Error');
    }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
