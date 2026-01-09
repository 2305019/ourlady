import React from 'react';
import Header from '../components/Header';

export default function Contact() {
  return (
    <div className="page-shell contact-page">
      <Header />
      <main className="content-container">
        <section className="intro-section">
          <h2>Contact Us</h2>
          <p className="intro-content">We'd love to hear from you. For questions about our services, mass bookings, or certificates, please use the contact details below.</p>
        </section>

        <section className="contact-grid" aria-label="Contact information">
          <div className="contact-card">
            <h3>Office</h3>
            <p><strong>Our Lady, Mother of the Poor Church</strong></p>
            <p>Tilamola, Sanguem, Goa 403713, India</p>
            <p>Postal Address: P.O. Box 123, Tilamola</p>
          </div>

          <div className="contact-card">
            <h3>Get in touch</h3>
            <p><strong>Phone:</strong> <a href="tel:+918321234567">+91 832 123 4567</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@tilamolachurch.org">info@tilamolachurch.org</a></p>
            <p><strong>Office Hours:</strong> Mon–Fri 9:00 AM – 5:00 PM</p>
          </div>

          <div className="contact-card">
            <h3>Coordinator</h3>
            <p>Fr. Michael Dias</p>
            <p><strong>Coordinator Email:</strong> <a href="mailto:coordinator@tilamolachurch.org">coordinator@tilamolachurch.org</a></p>
          </div>

          <div className="contact-card">
            <h3>Connect</h3>
            <p>Follow our parish for news and events on social media.</p>
            <p style={{marginTop:8}}>
              <a href="https://facebook.com/tilamolachurch" target="_blank" rel="noreferrer" style={{marginRight:12}}>Facebook</a>
              <a href="https://instagram.com/tilamolachurch" target="_blank" rel="noreferrer" style={{marginRight:12}}>Instagram</a>
              <a href="https://youtube.com/@tilamolachurch" target="_blank" rel="noreferrer">YouTube</a>
            </p>
          </div>
        </section>

        <section className="find-us-section">
          <div className="find-us-card">
            <h2 className="find-us-title">Find Us</h2>
            <div className="find-us-underline" aria-hidden></div>

            <div className="map-embed" role="region" aria-label="Church location map">
              {/* Google Maps embed (no API key required for basic embed) */}
              <iframe
                title="Church Location"
                src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=15.405,73.905+(Our+Lady+Mother+of+the+Poor+Church)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                style={{border:0, width:'100%', height:'540px'}}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
                <a href="https://www.google.com/maps/search/?api=1&query=15.405,73.905" target="_blank" rel="noreferrer" className="view-map-link">View larger map</a>
                <small style={{color:'#777'}}>Map data © Google</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}