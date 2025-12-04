// src/HomePage.js
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our Church Portal</h1>
        <p>Connecting Faith, Community, and Service</p>
      </header>

      <section className="home-section">
        <h2>Latest Announcements</h2>
        <ul>
          <li>Sunday Mass at 8:00 AM and 10:00 AM</li>
          <li>Youth Association Meeting on Friday</li>
          <li>New Gospel reflections posted daily</li>
        </ul>
      </section>

      <section className="home-section">
        <h2>Quick Links</h2>
        <div className="quick-links">
          <button>Mass Booking</button>
          <button>Request Certificate</button>
          <button>Login</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;