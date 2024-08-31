import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Intervals.css'; // Ensure you have CSS for styling

const Intervals = () => {
    const [intervalsData, setIntervalsData] = useState([]);
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
                console.log(`Fetched Session Key: ${selectedSession.session_key}`); // Log session key
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

    // Function to fetch intervals data using the session key
    const fetchIntervalsData = async () => {
        // For testing purposes, use session key 9574
        const testSessionKey = '9574'; // Define the test session key here

        if (!sessionKey && !testSessionKey) return;

        try {
            setLoading(true);
            const keyToUse = sessionKey || testSessionKey;
            console.log(`Using Session Key: ${keyToUse}`); // Log the session key being used
            const response = await axios.get(`https://api.openf1.org/v1/intervals?session_key=${keyToUse}`);
            console.log('Intervals Data:', response.data); // Log the fetched data
            if (response.data && response.data.length > 0) {
                // Filter data to keep only the most recent entry per driver
                const latestDataPerDriver = response.data.reduce((acc, data) => {
                    if (!acc[data.driver_number] || new Date(data.date) > new Date(acc[data.driver_number].date)) {
                        acc[data.driver_number] = data;
                    }
                    return acc;
                }, {});
                setIntervalsData(Object.values(latestDataPerDriver));
                setError(null);
            } else {
                setError('No intervals data available');
                setIntervalsData([]);
            }
        } catch (error) {
            setError('Error fetching intervals data');
            console.error('Error fetching intervals data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey || '9574') { // Ensure the fetchIntervalsData is triggered even with test session key
            fetchIntervalsData(); // Initial fetch
            const interval = setInterval(fetchIntervalsData, 5000); // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey]);

    const handleDriverSelect = (driverNumber) => {
        setSelectedDriver(driverNumber);
    };

    const filteredData = selectedDriver ? intervalsData.filter(data => data.driver_number === selectedDriver) : intervalsData;

    // Function to safely format number values
    const formatNumber = (value) => {
        const number = parseFloat(value);
        return !isNaN(number) ? number.toFixed(3) : 'N/A';
    };

    return (
        <div className="intervals-container">
            <h2>Driver Intervals</h2>
            {loading && <p>Loading data...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="driver-select-container">
                <label htmlFor="driver-select">Select Driver: </label>
                <select id="driver-select" onChange={(e) => handleDriverSelect(Number(e.target.value))}>
                    <option value="">All Drivers</option>
                    {[...new Set(intervalsData.map(data => data.driver_number))].map((number) => (
                        <option key={number} value={number}>
                            Driver #{number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="cards-container">
                {filteredData.map((data, index) => (
                    <div key={index} className="interval-card">
                        <h3>Driver #{data.driver_number}</h3>
                        <p><strong>Interval:</strong> {formatNumber(data.interval)}</p>
                        <p><strong>Gap to Leader:</strong> {formatNumber(data.gap_to_leader)}</p>
                        <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Intervals;
