import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Panggil dotenv.config() di awal
dotenv.config();

console.log("API Key dari ENV:", process.env.API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            console.error("Error from API:", data);
            return res.status(data.cod).json({ error: data.message });
        }

        res.json({
            temperature: data.main.temp,
            weather: data.weather[0].description,
            city: data.name,
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to the Weather API! Use /weather?city=YOUR_CITY to get weather data.");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});