import React, { useState, useEffect } from 'react';
import './WeatherData.css';

// Function to fetch live session key
const fetchSessionKey = async () => {
    try {
        const response = await fetch('https://api.openf1.org/v1/sessions');
        const sessions = await response.json();

        if (!sessions || sessions.length === 0) {
            console.error('No sessions data available');
            return null;
        }

        const currentTime = new Date().toISOString();

        // Find live session if exists
        const liveSession = sessions.find(
            session => new Date(session.date_start) <= new Date(currentTime) && new Date(session.date_end) >= new Date(currentTime)
        );

        // If no live session, find the most recent past session
        const mostRecentSession = sessions
            .filter(session => new Date(session.date_start) <= new Date(currentTime))
            .sort((a, b) => new Date(b.date_start) - new Date(a.date_start))[0];

        return liveSession ? liveSession.session_key : mostRecentSession ? mostRecentSession.session_key : null;
    } catch (error) {
        console.error('Error fetching session key:', error);
        return null;
    }
};

const WeatherData = () => {
    const [sessionKey, setSessionKey] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch the session key
            const key = await fetchSessionKey();
            if (!key) {
                setError('Unable to fetch session key');
                setLoading(false);
                return;
            }

            // Fetch the weather data
            try {
                const response = await fetch(`https://api.openf1.org/v1/weather?session_key=${key}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                setError('Error fetching weather data');
                console.error('Error fetching weather data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    // Find the most recent weather data
    const mostRecentWeather = weatherData.length > 0 ? weatherData.reduce((latest, entry) => {
        const entryDate = new Date(entry.date);
        return entryDate > new Date(latest.date) ? entry : latest;
    }, weatherData[0]) : null;

    return (
        <div className="weather-container">
            <div className="weather-details">
                <h1>Weather Data</h1>
                {mostRecentWeather ? (
                    <div className="weather-info">
                        <p><strong>Date:</strong> {new Date(mostRecentWeather.date).toLocaleString()}</p>
                        <p><strong>Air Temperature:</strong> {mostRecentWeather.air_temperature} °C</p>
                        <p><strong>Humidity:</strong> {mostRecentWeather.humidity} %</p>
                        <p><strong>Pressure:</strong> {mostRecentWeather.pressure} hPa</p>
                        <p><strong>Track Temperature:</strong> {mostRecentWeather.track_temperature} °C</p>
                        <p><strong>Wind Speed:</strong> {mostRecentWeather.wind_speed} km/h</p>
                        <p><strong>Wind Direction:</strong> {mostRecentWeather.wind_direction}°</p>
                    </div>
                ) : (
                    <p>No weather data available</p>
                )}
            </div>
        </div>
    );
};

export default WeatherData;
