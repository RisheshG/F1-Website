import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="sidebar">
            <div className="logo">
                <h1>Contents</h1>
            </div>
            <ul className="nav-links">
                <li><Link to="/" className="nav-item">Home</Link></li>
                <li><Link to="/car-data" className="nav-item">Car Data</Link></li>
                <li><Link to="/drivers" className="nav-item">Drivers</Link></li>
                <li><Link to="/intervals" className="nav-item">Intervals</Link></li>
                <li><Link to="/laps" className="nav-item">Laps</Link></li>
                <li><Link to="/location" className="nav-item">Location</Link></li>
                <li><Link to="/meetings" className="nav-item">Meetings</Link></li>
                <li><Link to="/pit-data" className="nav-item">Pit Data</Link></li>
                <li><Link to="/position-data" className="nav-item">Position Data</Link></li>
                <li><Link to="/race-control-data" className="nav-item">Race Control Data</Link></li>
                <li><Link to="/session-data" className="nav-item">Session Data</Link></li>
                <li><Link to="/stint-data" className="nav-item">Stint Data</Link></li>
                <li><Link to="/team-radio-data" className="nav-item">Team Radio Data</Link></li>
                <li><Link to="/weather-data" className="nav-item">Weather Data</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;