const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Giphy API base URL
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';
const API_KEY = process.env.GIPHY_KEY;

// Route to get trending GIFs
app.get('/api/trending', async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const response = await axios.get(`${GIPHY_BASE_URL}/trending`, {
            params: {
                api_key: API_KEY,
                limit,
                offset
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching trending GIFs:', error);
        res.status(500).json({ error: 'Failed to fetch trending GIFs' });
    }
});

// Route to search GIFs
app.get('/api/search', async (req, res) => {
    try {
        const { q, limit = 20, offset = 0 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const response = await axios.get(`${GIPHY_BASE_URL}/search`, {
            params: {
                api_key: API_KEY,
                q,
                limit,
                offset
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching GIFs:', error);
        res.status(500).json({ error: 'Failed to search GIFs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
