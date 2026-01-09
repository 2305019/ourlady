import { useEffect, useState } from 'react';
import Header from '../components/Header';
import UserCalendar from '../components/UserCalendar';
import * as eventsApi from '../api/events';
import '../styles/calendar.css';

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const ev = await eventsApi.getEvents();
        setEvents(ev);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }
    load();
  }, []);

  return (
    <div className="page-shell calendar-page">
      <Header />
      <main className="content-container">
        <section className="intro-section" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.5rem',
            fontWeight: '900',
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            Church Calendar
          </h2>
          <div className="intro-content">
            <p style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: '#4b5563',
              textAlign: 'center',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Here you can find our church calendar with important feast days, Mass schedules, and
              special events. Plan your visits and stay updated with our church community.
            </p>
          </div>
        </section>

        <section className="intro-section" style={{ background: 'transparent', padding: '0', boxShadow: 'none', border: 'none' }}>
          <div className="calendar-wrapper">
            <UserCalendar events={events} />
          </div>
        </section>
      </main>
    </div>
  );
}
