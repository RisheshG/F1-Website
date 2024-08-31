import React, { useState, useEffect } from 'react';
import './TeamRadioData.css';

function TeamRadioData() {
    const [teamRadioData, setTeamRadioData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [sessionKey, setSessionKey] = useState(null);

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

    // Function to fetch team radio data using the session key
    const fetchTeamRadioData = async (sessionKey) => {
        try {
            const response = await fetch(`https://api.openf1.org/v1/team_radio?session_key=${sessionKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching team radio data:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchSessionKey();
            if (sessionKey) {
                const data = await fetchTeamRadioData(sessionKey);
                setTeamRadioData(data);
            }
        };
        loadData();
    }, [sessionKey]);

    return (
        <div className="team-radio-container">
            <h1>Team Radio Data</h1>
            <div className="radio-data-container">
                {teamRadioData.length > 0 ? (
                    teamRadioData.map((item, index) => (
                        <div key={index} className="radio-data-item">
                            <p><strong>Driver Number:</strong> {item.driver_number}</p>
                            <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
                            <audio controls>
                                <source src={item.recording_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))
                ) : (
                    <p>No team radio data available</p>
                )}
            </div>
        </div>
    );
}

export default TeamRadioData;
