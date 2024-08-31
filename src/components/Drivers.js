import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Driver.css'; // Ensure you have CSS for styling

const Driver = () => {
    const [driverData, setDriverData] = useState([]);
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

    // Function to fetch driver data using the session key
    const fetchDriverData = async () => {
        if (!sessionKey) return;

        try {
            setLoading(true);
            const response = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
            if (response.data && response.data.length > 0) {
                setDriverData(response.data);
                setError(null);
            } else {
                setError('No driver data available');
                setDriverData([]);
            }
        } catch (error) {
            setError('Error fetching driver data');
            console.error('Error fetching driver data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchDriverData();  // Initial fetch
            const interval = setInterval(fetchDriverData, 5000);  // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey]);

    const handleDriverSelect = (driverNumber) => {
        setSelectedDriver(driverNumber);
    };

    const filteredData = selectedDriver ? driverData.filter(data => data.driver_number === selectedDriver) : driverData;

    // Get unique driver numbers for selection
    const driverNumbers = [...new Set(driverData.map(data => data.driver_number))];

    return (
        <div className="driver-data-container">
            <h2>F1 Driver Data</h2>
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
            <div className="cards-container">
                {filteredData.map((data) => (
                    <div key={data.driver_number} className="driver-card" style={{ borderColor: data.team_colour }}>
                        <img src={data.headshot_url} alt={data.full_name} className="driver-headshot" />
                        <h3>{data.full_name}</h3>
                        <p><strong>Driver Number:</strong> {data.driver_number}</p>
                        <p><strong>Team:</strong> {data.team_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Driver;
