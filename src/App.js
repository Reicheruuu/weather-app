import React, { useState, useEffect } from "react";
import SearchBar from "./components/Search";
import History from "./components/History";
import Forecast from "./components/Forecast";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load history from database
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/searches/all`);
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchSearchHistory();
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      setError(null);
      setIsLoading(true);
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`${API_URL}/api/weather/${cityName}`),
        fetch(`${API_URL}/api/forecast/${cityName}`)
      ]);
      
      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error("City not found. Please try again!");
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      
      setWeather(weatherData);
      setForecast(forecastData);

      // Save search to database
      await fetch(`${API_URL}/api/searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityName: weatherData.name,
          temperature: weatherData.main.temp,
          description: weatherData.weather[0].description
        }),
      });

      // Fetch updated history
      const historyResponse = await fetch(`${API_URL}/api/searches/all`);
      const historyData = await historyResponse.json();
      setHistory(historyData);

    } catch (error) {
      setError(error.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`App ${weather?.weather[0]?.main?.toLowerCase() || ''}`}>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      
      <h1 className="text-4xl font-bold text-white text-center mb-8">Weather Dashboard</h1>
      <SearchBar onSearch={fetchWeather} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="try-again-btn"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && <div className="loader">Loading...</div>}

      {weather && (
        <div className="weather-info-current">
          <h1>Current Weather in {weather.name}</h1>
          <div className="weather-details">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <h2>{Math.round(weather.main.temp)}°C</h2>
            <div className="weather-stats">
              <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}

      {forecast && <Forecast data={forecast} />}
      
      <History history={history} onSelectCity={fetchWeather} />
    </div>
  );
}

export default App;
