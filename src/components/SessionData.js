import React, { useState, useEffect } from "react";
import "./SessionData.css"; // Import the CSS file

function SessionData() {
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the most recent meeting key
    fetch("https://api.openf1.org/v1/meetings")
      .then((response) => response.json())
      .then((meetings) => {
        if (meetings.length > 0) {
          // Sort meetings by date to get the most recent one
          const recentMeeting = meetings.sort(
            (a, b) => new Date(b.date_start) - new Date(a.date_start)
          )[0];

          // Get the most recent meeting key
          const recentMeetingKey = recentMeeting.meeting_key;

          console.log("Most Recent Meeting Key:", recentMeetingKey);

          // Fetch session data using the recent meeting key
          fetch(`https://api.openf1.org/v1/sessions?meeting_key=${recentMeetingKey}`)
            .then((response) => response.json())
            .then((data) => {
              setSessionData(data);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching session data:", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading session data...</div>;
  }

  if (sessionData.length === 0) {
    return <div className="no-data">No session data available.</div>;
  }

  return (
    <div className="session-container">
      <h2 className="session-heading">Recent F1 Sessions</h2>
      <div className="sessions-list">
        {sessionData.map((session) => (
          <div key={session.session_key} className="session-card">
            <h3 className="session-name">{session.session_name}</h3>
            <p className="session-type">{session.session_type}</p>
            <p className="session-location">
              {session.location}, {session.country_name}
            </p>
            <p className="session-date">
              {new Date(session.date_start).toLocaleString()} - {new Date(session.date_end).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionData;
