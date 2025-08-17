const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const WeatherSearch = require('./models/WeatherSearch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

const API_KEY = process.env.WEATHER_API; // Move this to .env file in production

// Allow frontend domain
app.use(cors({
  origin: "https://reicheruuu.github.io", 
  methods: ["GET", "POST"],
  credentials: true
}));


// OR if you want to allow all origins (not recommended for prod):
// app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Connect to database
connectDB();

app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    res.json(response.data);
  } catch (error) {
    res.status(404).json({ message: 'City not found' });
  }
});

app.get('/api/forecast/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ message: 'Forecast not found' });
  }
});

// New routes for weather searches
app.get('/api/searches/all', async (req, res) => {
  try {
    const searches = await WeatherSearch.find()
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching searches' });
  }
});

app.post('/api/searches', async (req, res) => {
  try {
    const { cityName, temperature, description } = req.body;
    const weatherSearch = new WeatherSearch({
      cityName,
      temperature,
      description
    });
    await weatherSearch.save();
    res.status(201).json(weatherSearch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

