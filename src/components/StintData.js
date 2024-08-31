import React, { useEffect, useState } from 'react';
import './StintData.css';

function StintData() {
    const [stintData, setStintData] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [error, setError] = useState('');
    const [sessionKey, setSessionKey] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch live session key
    const fetchSessionKey = async () => {
        try {
            const response = await fetch('https://api.openf1.org/v1/sessions');
            const sessions = await response.json();

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

    // Function to fetch stint data using the session key
    const fetchStintData = async (sessionKey) => {
        if (!sessionKey) return;

        try {
            const response = await fetch(`https://api.openf1.org/v1/stints?session_key=${sessionKey}`);
            const data = await response.json();
            setStintData(data);

            // Get unique driver numbers for selection
            const uniqueDrivers = [...new Set(data.map(stint => stint.driver_number))];
            setDrivers(uniqueDrivers);
            setError(null);
        } catch (error) {
            setError('Error fetching stint data');
            console.error('Error fetching stint data:', error);
        }
    };

    useEffect(() => {
        fetchSessionKey();
    }, []);

    useEffect(() => {
        if (sessionKey) {
            fetchStintData(sessionKey);
        }
    }, [sessionKey]);

    // Handle driver selection
    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

    // Filter stint data by the selected driver
    const filteredStintData = stintData.filter(stint => stint.driver_number.toString() === selectedDriver);

    return (
        <div className="stint-data-container">
            <h1>Stint Data</h1>
            {loading && <p>Loading data...</p>}
            {error && <p className="error">{error}</p>}
            <div className="dropdown-container">
                <label htmlFor="driver-select">Select Driver:</label>
                <select id="driver-select" value={selectedDriver} onChange={handleDriverChange}>
                    <option value="">-- Select Driver --</option>
                    {drivers.map(driver => (
                        <option key={driver} value={driver}>{driver}</option>
                    ))}
                </select>
            </div>
            <div className="stint-table-container">
                <table className="stint-table">
                    <thead>
                        <tr>
                            <th>Stint Number</th>
                            <th>Lap Start</th>
                            <th>Lap End</th>
                            <th>Compound</th>
                            <th>Tyre Age at Start</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStintData.map((stint, index) => (
                            <tr key={index}>
                                <td>{stint.stint_number}</td>
                                <td>{stint.lap_start}</td>
                                <td>{stint.lap_end}</td>
                                <td>{stint.compound}</td>
                                <td>{stint.tyre_age_at_start}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StintData;
