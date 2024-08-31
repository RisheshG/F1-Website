import React from 'react';
import './DocumentationPage.css';

const DocumentationPage = () => {
    return (
        <div className="documentation-container">
            <h1 className="header">OpenF1 API Integration Guide</h1>
            <p><strong>Author:</strong> Rishesh Gangwar</p>
            <p><strong>Description:</strong> This document provides an overview of how to integrate with the OpenF1 API, including available methods, sample requests, and data attributes.</p>

            <hr />

            <h2>Introduction</h2>
            <p>
                OpenF1 is a free and open-source API providing real-time and historical Formula 1 data, including lap timings, car telemetry, radio communications, and more.
                Data is available in JSON or CSV formats.
            </p>
            <p><strong>Note:</strong> OpenF1 is an unofficial project and not associated with Formula 1 companies.</p>

            <hr />

            <h2>API Methods</h2>

            <h3>Car Data</h3>
            <p>Fetches real-time data about each car, sampled at approximately 3.7 Hz.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} driver_number - Unique number assigned to the F1 driver.
 * @param {number} session_key - Unique identifier for the session.
 * @param {number} speed - Minimum speed in km/h.
 * @returns {Object[]} - Array of car data objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315"
 */`}
                </code>
            </pre>

            <h3>Drivers</h3>
            <p>Provides information about drivers for each session.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} driver_number - Unique number assigned to the F1 driver.
 * @param {number} session_key - Unique identifier for the session.
 * @returns {Object[]} - Array of driver objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158"
 */`}
                </code>
            </pre>

            <h3>Intervals</h3>
            <p>Fetches real-time interval data between drivers and their gap to the race leader.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} session_key - Unique identifier for the session.
 * @param {number} interval - Time gap between drivers in seconds.
 * @returns {Object[]} - Array of interval objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/intervals?session_key=9165&interval<0.005"
 */`}
                </code>
            </pre>

            <h3>Laps</h3>
            <p>Provides detailed information about individual laps.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} session_key - Unique identifier for the session.
 * @param {number} driver_number - Unique number assigned to the F1 driver.
 * @param {number} lap_number - Sequential number of the lap within the session.
 * @returns {Object[]} - Array of lap objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8"
 */`}
                </code>
            </pre>

            <h3>Location</h3>
            <p>Provides approximate location of cars on the circuit.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} session_key - Unique identifier for the session.
 * @param {number} driver_number - Unique number assigned to the F1 driver.
 * @param {string} dateRange - Date range for location data (e.g., "2023-09-16T13:03:35.200 to 2023-09-16T13:03:35.800").
 * @returns {Object[]} - Array of location objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date>2023-09-16T13:03:35.200&date<2023-09-16T13:03:35.800"
 */`}
                </code>
            </pre>

            <h3>Meetings</h3>
            <p>Provides information about meetings, such as Grand Prix or testing weekends.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} year - Year of the meeting.
 * @param {string} country_name - Country name where the meeting takes place.
 * @returns {Object[]} - Array of meeting objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/meetings?year=2023&country_name=Singapore"
 */`}
                </code>
            </pre>

            <h3>Pit</h3>
            <p>Provides information about cars going through the pit lane.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} session_key - Unique identifier for the session.
 * @param {number} pit_duration - Maximum duration of the pit stop in seconds.
 * @returns {Object[]} - Array of pit stop objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/pit?session_key=9158&pit_duration<31"
 */`}
                </code>
            </pre>

            <h3>Position</h3>
            <p>Provides driver positions throughout a session.</p>
            <pre className="code-block">
                <code>
                    {`/**
 * @param {number} meeting_key - Unique identifier for the meeting.
 * @param {number} driver_number - Unique number assigned to the F1 driver.
 * @param {number} position - Position of the driver.
 * @returns {Object[]} - Array of position objects.
 * 
 * Example:
 * curl "https://api.openf1.org/v1/position?meeting_key=1217&driver_number=40&position<=3"
 */`}
                </code>
            </pre>

            <hr />

            <h2>Data Attributes</h2>

            <h3>Car Data</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} CarData
 * @property {number} brake - Whether the brake pedal is pressed (100) or not (0).
 * @property {string} date - The UTC date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} drs - The Drag Reduction System (DRS) status.
 * @property {number} meeting_key - The unique identifier for the meeting.
 * @property {number} n_gear - Current gear selection.
 * @property {number} rpm - Revolutions per minute of the engine.
 * @property {number} session_key - The unique identifier for the session.
 * @property {number} speed - Velocity of the car in km/h.
 * @property {number} throttle - Percentage of maximum engine power being used.
 */`}
                </code>
            </pre>

            <h3>Drivers</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Driver
 * @property {string} broadcast_name - The driver's name as displayed on TV.
 * @property {string} country_code - Code that uniquely identifies the country.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {string} first_name - The driver's first name.
 * @property {string} full_name - The driver's full name.
 * @property {string} headshot_url - URL of the driver's face photo.
 * @property {string} last_name - The driver's last name.
 * @property {string} name - Driver's name with title.
 * @property {string} nationality - The nationality of the driver.
 */`}
                </code>
            </pre>

            <h3>Intervals</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Interval
 * @property {string} date - The UTC date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} gap - The time gap to the leader in seconds.
 * @property {number} meeting_key - The unique identifier for the meeting.
 * @property {number} session_key - The unique identifier for the session.
 */`}
                </code>
            </pre>

            <h3>Laps</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Lap
 * @property {number} lap_number - The lap number.
 * @property {string} lap_time - The lap time in the format mm:ss.sss.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
  * @property {number} session_key - The unique identifier for the session.
 * @property {number} lap_speed - The average speed of the lap in km/h.
 */`}
                </code>
            </pre>

            <h3>Location</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Location
 * @property {string} date - The UTC date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} session_key - The unique identifier for the session.
 * @property {number} x - The x-coordinate of the car's location.
 * @property {number} y - The y-coordinate of the car's location.
 */`}
                </code>
            </pre>

            <h3>Meetings</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Meeting
 * @property {string} country_name - The name of the country where the meeting takes place.
 * @property {number} meeting_key - The unique identifier for the meeting.
 * @property {string} meeting_name - The name of the meeting.
 * @property {number} year - The year of the meeting.
 */`}
                </code>
            </pre>

            <h3>Pit</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} PitStop
 * @property {string} date - The UTC date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} pit_duration - The duration of the pit stop in seconds.
 * @property {number} session_key - The unique identifier for the session.
 */`}
                </code>
            </pre>

            <h3>Position</h3>
            <pre className="code-block">
                <code>
                    {`/**
 * @typedef {Object} Position
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} meeting_key - The unique identifier for the meeting.
 * @property {number} position - The driver's position in the session.
 */`}
                </code>
            </pre>

            <hr />

            <h2>Conclusion</h2>
            <p>This documentation provides a high-level overview of the OpenF1 API, detailing available methods, data attributes, and sample requests. Visit the <a href="https://openf1.org/?shell#stints" target="_blank" rel="noopener noreferrer">OpenF1 Documentation</a> page for more details.</p>
        </div>
    );
};

export default DocumentationPage;
