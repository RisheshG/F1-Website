import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CarData from './components/CarData';
import Drivers from './components/Drivers';
import Intervals from './components/Intervals';
import Laps from './components/Laps';
import Location from './components/Location';
import Meetings from './components/Meetings';
import PitData from './components/PitData';
import PositionData from './components/PositionData';
import RaceControlData from './components/RaceControlData';
import SessionData from './components/SessionData';
import StintData from './components/StintData';
import TeamRadioData from './components/TeamRadioData';
import WeatherData from './components/WeatherData';
import DocumentationPage from './components/DocumentationPage'; 

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/car-data" element={<CarData />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/intervals" element={<Intervals />} />
                    <Route path="/laps" element={<Laps />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/meetings" element={<Meetings />} />
                    <Route path="/pit-data" element={<PitData />} />
                    <Route path="/position-data" element={<PositionData />} />
                    <Route path="/race-control-data" element={<RaceControlData />} />
                    <Route path="/session-data" element={<SessionData />} />
                    <Route path="/stint-data" element={<StintData />} />
                    <Route path="/team-radio-data" element={<TeamRadioData />} />
                    <Route path="/weather-data" element={<WeatherData />} />
                    <Route path="/documentation" element={<DocumentationPage />} /> {/* Add the new route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
