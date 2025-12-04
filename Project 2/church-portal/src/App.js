// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import MassBookingForm from './MassBookingForm';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mass-booking" element={<MassBookingForm />} />
      </Routes>
    </Router>
  );
}

export default App;