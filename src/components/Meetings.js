import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Meetings.css'; // Ensure you have this CSS file for styling

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Generate a list of years from 2023 to the current year
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2023;
        const yearsArray = [];
        for (let year = startYear; year <= currentYear; year++) {
            yearsArray.push(year);
        }
        setYears(yearsArray);
    };

    // Fetch meetings data based on selected year
    const fetchMeetings = async (year) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.openf1.org/v1/meetings?year=${year}`);
            setMeetings(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching meetings data');
            console.error('Error fetching meetings data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateYearOptions();
        fetchMeetings(selectedYear);
    }, [selectedYear]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className="meetings-container">
            <h2>F1 Meetings</h2>
            <div className="year-select-container">
                <label htmlFor="year-select">Select Year: </label>
                <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {loading && <p>Loading data...</p>}
            {error && <p className="error-message">{error}</p>}
            {meetings.length > 0 && (
                <table className="meetings-table">
                    <thead>
                        <tr>
                            <th>Meeting Name</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Country</th>
                            <th>Circuit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting) => (
                            <tr key={meeting.meeting_key}>
                                <td>{meeting.meeting_official_name}</td>
                                <td>{meeting.location}</td>
                                <td>{new Date(meeting.date_start).toLocaleString()}</td>
                                <td>{meeting.country_name}</td>
                                <td>{meeting.circuit_short_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Meetings;
