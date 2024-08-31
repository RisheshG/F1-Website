import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PitData.css'; // Ensure you have CSS for styling

const PitData = () => {
    const [pitData, setPitData] = useState([]);
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

    // Function to fetch pit data using the session key
    const fetchPitData = async () => {
        if (!sessionKey) return;

        try {
            setLoading(true);
            const response = await axios.get(`https://api.openf1.org/v1/pit?session_key=${sessionKey}`);
            if (response.data && response.data.length > 0) {
                setPitData(response.data);
                setError(null);
            } else {
                setError('No pit data available');
                setPitData([]);
            }
        } catch (error) {
            setError('Error fetching pit data');
            console.error('Error fetching pit data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchPitData();  // Initial fetch
            const interval = setInterval(fetchPitData, 5000);  // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey]);

    const handleDriverSelect = (driverNumber) => {
        setSelectedDriver(driverNumber);
    };

    const filteredData = selectedDriver ? pitData.filter(data => data.driver_number === selectedDriver) : pitData;

    // Get unique driver numbers for selection
    const driverNumbers = [...new Set(pitData.map(data => data.driver_number))];

    return (
        <div className="pit-data-container">
            <h2>F1 Pit Stop Data</h2>
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
            <div className="pit-data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Driver #</th>
                            <th>Date</th>
                            <th>Lap Number</th>
                            <th>Pit Duration (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.driver_number}</td>
                                <td>{new Date(data.date).toLocaleString()}</td>
                                <td>{data.lap_number}</td>
                                <td>{data.pit_duration != null ? data.pit_duration.toFixed(1) : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PitData;
