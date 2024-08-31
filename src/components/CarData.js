import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CarData.css'; // Ensure you have CSS for styling

const CarData = () => {
    const [carData, setCarData] = useState([]);
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

    // Function to fetch car data using the session key
    const fetchCarData = async () => {
        if (!sessionKey) return;

        try {
            setLoading(true);
            const response = await axios.get(`https://api.openf1.org/v1/car_data?session_key=${sessionKey}&speed>=315`);
            if (response.data && response.data.length > 0) {
                // Process data to get the latest entry per driver
                const latestData = response.data.reduce((acc, data) => {
                    if (!acc[data.driver_number] || new Date(data.date) > new Date(acc[data.driver_number].date)) {
                        acc[data.driver_number] = data;
                    }
                    return acc;
                }, {});
                
                setCarData(Object.values(latestData));
                setError(null);
            } else {
                setError('No car data available');
                setCarData([]);
            }
        } catch (error) {
            setError('Error fetching car data');
            console.error('Error fetching car data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchCarData();  // Initial fetch
            const interval = setInterval(fetchCarData, 5000);  // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey]);

    const handleDriverSelect = (driverNumber) => {
        setSelectedDriver(driverNumber);
    };

    const filteredData = selectedDriver ? carData.filter(data => data.driver_number === selectedDriver) : carData;

    // Get unique driver numbers for selection
    const driverNumbers = [...new Set(carData.map(data => data.driver_number))];

    return (
        <div className="car-data-container">
            <h2>F1 Car Data</h2>
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
                {filteredData.map((data, index) => (
                    <div key={index} className="car-card">
                        <h3>Driver #{data.driver_number}</h3>
                        <p><strong>Speed:</strong> {data.speed} km/h</p>
                        <p><strong>RPM:</strong> {data.rpm}</p>
                        <p><strong>Gear:</strong> {data.n_gear}</p>
                        <p><strong>Throttle:</strong> {data.throttle}%</p>
                        <p><strong>Brake:</strong> {data.brake}%</p>
                        <p><strong>DRS:</strong> {data.drs ? 'Active' : 'Inactive'}</p>
                        <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarData;
