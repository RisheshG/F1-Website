import React, { useEffect, useState } from 'react';
import './RaceControlData.css';

const RaceControlData = () => {
  const [raceControlMessages, setRaceControlMessages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetingKey = async () => {
      try {
        const response = await fetch('https://api.openf1.org/v1/meetings');
        if (!response.ok) throw new Error('Failed to fetch meetings');
        const meetings = await response.json();

        // Find the most recent meeting
        const mostRecentMeeting = meetings.reduce((latest, meeting) => 
          new Date(meeting.date_start) > new Date(latest.date_start) ? meeting : latest, 
          meetings[0]
        );

        return mostRecentMeeting?.meeting_key;
      } catch (err) {
        setError(err.message);
        return null;
      }
    };

    const fetchRaceControlMessages = async (meetingKey) => {
      try {
        const response = await fetch(`https://api.openf1.org/v1/race_control?meeting_key=${meetingKey}`);
        if (!response.ok) throw new Error('Failed to fetch race control messages');
        const messages = await response.json();

        setRaceControlMessages(messages);

        // Extract unique drivers
        const driverNumbers = [...new Set(messages.map(msg => msg.driver_number))].filter(Boolean);
        setDrivers(driverNumbers);

      } catch (err) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      const meetingKey = await fetchMeetingKey();
      if (meetingKey) {
        await fetchRaceControlMessages(meetingKey);
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="error">Error: {error}</div>;

  const handleDriverChange = (e) => {
    setSelectedDriver(e.target.value);
  };

  const filteredMessages = selectedDriver
    ? raceControlMessages.filter(msg => msg.driver_number === parseInt(selectedDriver))
    : raceControlMessages;

  return (
    <div className="race-control-data">
      <h1>Race Control Messages</h1>
      <div className="dropdown-container">
        <label htmlFor="driver-select">Select Driver:</label>
        <select id="driver-select" value={selectedDriver} onChange={handleDriverChange}>
          <option value="">All Drivers</option>
          {drivers.map(driver => (
            <option key={driver} value={driver}>Driver {driver}</option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Message</th>
            <th>Driver Number</th>
            <th>Flag</th>
            <th>Scope</th>
            <th>Sector</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((message, index) => (
            <tr key={index}>
              <td>{new Date(message.date).toLocaleString()}</td>
              <td>{message.category}</td>
              <td>{message.message}</td>
              <td>{message.driver_number ?? 'N/A'}</td>
              <td>{message.flag ?? 'N/A'}</td>
              <td>{message.scope ?? 'N/A'}</td>
              <td>{message.sector ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RaceControlData;
