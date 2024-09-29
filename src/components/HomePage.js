import React from 'react';
import './HomePage.css';

// Dynamic Footer Data
const footerData = {
  companyName: 'Rishesh Gangwar',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/RisheshG' },
    { name: 'Resume', url: 'https://www.canva.com/design/DAGPoNnC3gk/FyQNSsi_6Gq1yTHgYHdVhw/edit' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rishesh-gangwar-bb7026241/' },
  ]
};

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to F1 Insights</h1>
          <p>Explore the latest F1 news, driver statistics, and race results with our comprehensive platform.</p>
          <a href="/documentation" className="cta-button">Integration</a>
        </div>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2>About Us</h2>
          <p>At F1 Insights, we provide in-depth analysis, real-time updates, and detailed statistics about Formula 1. Our platform is designed for fans and professionals alike, offering insights into the thrilling world of Formula 1 racing.</p>
        </div>
      </section>

      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Live Feed Integration</h3>
            <p>Access real-time updates from the live feed, including comprehensive car data, session details, and other critical information.</p>
          </div>
          <div className="feature-item">
            <h3>Radio Messages</h3>
            <p>Listen to team radio messages for live updates and team strategies directly from the pit wall and drivers.</p>
          </div>
          <div className="feature-item">
            <h3>Session Information</h3>
            <p>Get insights into session data such as lap times, track conditions, and session progress to stay ahead of the action.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 {footerData.companyName}. All rights reserved.</p>
          <div className="social-links">
            {footerData.socialLinks.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;