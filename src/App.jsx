import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";
import { useTemperature } from "./TemperatureContext";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const { isCelsius, toggleTemperatureUnit } = useTemperature();

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      updateRecentSearches(data.location.name);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeatherData(cityName);
    }
  };

  const updateRecentSearches = (city) => {
    const updatedSearches = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleRecentSearch = (city) => {
    setCityName(city);
    fetchWeatherData(city);
  };

  const getTemperature = () => {
    if (!weatherData) return "";
    return isCelsius 
      ? `${weatherData.current.temp_c} °C` 
      : `${weatherData.current.temp_f} °F`;
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="unit-toggle">
        <span>°C</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={!isCelsius}
            onChange={toggleTemperatureUnit}
          />
          <span className="slider round"></span>
        </label>
        <span>°F</span>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {weatherData && (
        <div className="weather-info">
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>Temperature: {getTemperature()}</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Pressure: {weatherData.current.pressure_mb} mb</p>
          <p>Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((city, index) => (
              <li key={index} onClick={() => handleRecentSearch(city)}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;