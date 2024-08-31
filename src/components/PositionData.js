import React, { useEffect, useState } from 'react';
import './PositionData.css';

const PositionData = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);

  // Function to fetch the most recent session key
  const fetchSessionKey = async () => {
    try {
      const response = await fetch('https://api.openf1.org/v1/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const sessions = await response.json();

      if (!sessions || sessions.length === 0) {
        setError('No sessions data available');
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
    }
  };

  // Function to fetch position data using the session key
  const fetchPositions = async (sessionKey) => {
    try {
      const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      const positionData = await response.json();

      // Process data to get the latest position for each driver
      const latestPositions = positionData.reduce((acc, item) => {
        if (!acc[item.driver_number] || new Date(item.date) > new Date(acc[item.driver_number].date)) {
          acc[item.driver_number] = item;
        }
        return acc;
      }, {});

      setPositions(Object.values(latestPositions).sort((a, b) => a.position - b.position));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSessionKey();
  }, []);

  useEffect(() => {
    if (sessionKey) {
      fetchPositions(sessionKey);  // Initial fetch
      const interval = setInterval(() => fetchPositions(sessionKey), 5000);  // Fetch data every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sessionKey]);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="position-data">
      <h1>Current Driver Positions</h1>
      <table>
        <thead>
          <tr>
            <th>Driver Number</th>
            <th>Position</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => (
            <tr key={position.driver_number}>
              <td>{position.driver_number}</td>
              <td>{position.position}</td>
              <td>{new Date(position.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionData;
