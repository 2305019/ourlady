import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/association">Association</Link></li>
        <li><Link to="/daily-gospel">Daily Gospel</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/mass-booking">Mass Booking</Link></li>
        <li><Link to="/request-certificate">Request Certificate</Link></li>
        <li><Link to="/announcement">Announcement</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;