import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Location.css'; // Ensure you have CSS for styling

const drivers = [
    { number: 1, name: 'Netherlands Max Verstappen' },
    { number: 4, name: 'United Kingdom Lando Norris' },
    { number: 10, name: 'France Pierre Gasly' },
    { number: 11, name: 'Mexico Sergio Perez' },
    { number: 14, name: 'Spain Fernando Alonso' },
    { number: 16, name: 'Monaco Charles Leclerc' },
    { number: 18, name: 'Canada Lance Stroll' },
    { number: 20, name: 'Denmark Kevin Magnussen' },
    { number: 22, name: 'Japan Yuki Tsunoda' },
    { number: 23, name: 'Thailand Alex Albon' },
    { number: 24, name: 'China Guanyu Zhou' },
    { number: 27, name: 'Germany Nico Hulkenberg' },
    { number: 31, name: 'France Esteban Ocon' },
    { number: 40, name: 'New Zealand Liam Lawson' },
    { number: 43, name: 'Argentina 	Franco Colapinto' },
    { number: 44, name: 'United Kingdom Lewis Hamilton' },
    { number: 55, name: 'Spain Carlos Sainz' },
    { number: 63, name: 'United Kingdom George Russell' },
    { number: 77, name: 'Finland Valtteri Bottas' },
    { number: 81, name: 'Australia Oscar Piastri' }
];

const Location = () => {
    const [locationData, setLocationData] = useState([]);
    const [sessionKey, setSessionKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState('');

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

    // Function to fetch location data using the session key and selected driver number
    const fetchLocationData = async () => {
        if (!sessionKey) return;

        try {
            setLoading(true);
            const driverParam = selectedDriver ? `&driver_number=${selectedDriver}` : '';
            const response = await axios.get(`https://api.openf1.org/v1/location?session_key=${sessionKey}${driverParam}`);
            
            if (response.data && response.data.length > 0) {
                const data = response.data;
                
                // Process data to keep only the latest location for each driver
                const latestLocations = {};
                
                data.forEach((entry) => {
                    if (!latestLocations[entry.driver_number] || new Date(entry.date) > new Date(latestLocations[entry.driver_number].date)) {
                        latestLocations[entry.driver_number] = entry;
                    }
                });
                
                // Convert the object back to an array
                const latestLocationsArray = Object.values(latestLocations);
                
                setLocationData(latestLocationsArray);
                setError(null);
            } else {
                setError('No location data available');
                setLocationData([]);
            }
        } catch (error) {
            setError('Error fetching location data');
            console.error('Error fetching location data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchLocationData();  // Initial fetch
            const interval = setInterval(fetchLocationData, 5000);  // Fetch data every 5 seconds
            return () => clearInterval(interval);
        }
    }, [sessionKey, selectedDriver]);

    const handleDriverSelect = (event) => {
        setSelectedDriver(event.target.value);
    };

    return (
        <div className="location-container">
            <h2>F1 Driver Locations</h2>
            {loading && <p>Loading data...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="driver-select-container">
                <label htmlFor="driver-select">Select Driver: </label>
                <select id="driver-select" onChange={handleDriverSelect}>
                    <option value="">All Drivers</option>
                    {drivers.map(driver => (
                        <option key={driver.number} value={driver.number}>
                            {driver.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="cards-container">
                {locationData.map((data, index) => (
                    <div key={index} className="location-card">
                        <h3>Driver #{data.driver_number}</h3>
                        <p><strong>X:</strong> {data.x}</p>
                        <p><strong>Y:</strong> {data.y}</p>
                        <p><strong>Z:</strong> {data.z}</p>
                        <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Location;
