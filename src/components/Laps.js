import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Laps.css'; // Ensure you have CSS for styling

const Laps = () => {
    const [lapsData, setLapsData] = useState([]);
    const [sessionKey, setSessionKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // Function to fetch live session key
    const fetchSessionKey = async () => {
        try {
            const sessionResponse = await axios.get('https://api.openf1.org/v1/sessions');
            const sessions = sessionResponse.data;

            if (!sessions || sessions.length === 0) {
                setError('No sessions data available');
                setLoading(false);
                return;
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

            const selectedSession = liveSession || mostRecentSession;

            if (selectedSession) {
                setSessionKey(selectedSession.session_key);
            } else {
                setError('No valid session found');
            }
        } catch (error) {
            setError('Error fetching session key');
            console.error('Error fetching session key:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch lap data using the session key
    const fetchLapsData = async () => {
        if (!sessionKey) return;

        try {
            setLoading(true);
            const response = await axios.get(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`);
            if (response.data && response.data.length > 0) {
                setLapsData(response.data);
                setError(null);
            } else {
                setError('No lap data available');
                setLapsData([]);
            }
        } catch (error) {
            setError('Error fetching lap data');
            console.error('Error fetching lap data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchLapsData();  // Initial fetch
            const interval = setInterval(fetchLapsData, 5000);  // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey]);

    const handleDriverSelect = (driverNumber) => {
        setSelectedDriver(driverNumber);
    };

    const filteredData = selectedDriver ? lapsData.filter(data => data.driver_number === selectedDriver) : lapsData;

    // Get unique driver numbers for selection
    const driverNumbers = [...new Set(lapsData.map(data => data.driver_number))];

    return (
        <div className="laps-container">
            <h2>F1 Laps Data</h2>
            {loading && <p>Loading data...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="driver-select-container">
                <label htmlFor="driver-select">Select Driver: </label>
                <select id="driver-select" onChange={(e) => handleDriverSelect(Number(e.target.value))}>
                    <option value="">All Drivers</option>
                    {driverNumbers.map((number) => (
                        <option key={number} value={number}>
                            Driver #{number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="laps-list">
                {filteredData.map((data, index) => (
                    <div key={index} className="lap-card">
                        <h3>Driver #{data.driver_number} - Lap #{data.lap_number}</h3>
                        <p><strong>Start Time:</strong> {new Date(data.date_start).toLocaleString()}</p>
                        <p><strong>Sector 2 Duration:</strong> {data.duration_sector_2 || 'N/A'} seconds</p>
                        <p><strong>Sector 3 Duration:</strong> {data.duration_sector_3 || 'N/A'} seconds</p>
                        <p><strong>Speed in Sector 1:</strong> {data.i1_speed || 'N/A'} km/h</p>
                        <p><strong>Speed in Sector 2:</strong> {data.i2_speed || 'N/A'} km/h</p>
                        <p><strong>Is Pit Out Lap:</strong> {data.is_pit_out_lap ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Laps;
