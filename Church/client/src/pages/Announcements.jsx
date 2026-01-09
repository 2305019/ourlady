import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AnnouncementList from "../components/AnnouncementList";
import * as announcementsApi from "../api/announcements";
import "../styles/announcements.css";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await announcementsApi.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error loading announcements:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page-shell announcements-page">
      <Header />
      <main className="content-container">
        <section className="intro-section announcement-hero">
          <div className="announcement-hero__glow" aria-hidden />
          <h2>Announcements</h2>
          <p className="intro-content">
            Stay updated with parish news, upcoming gatherings, and ways to get
            involved. We keep this space lively so you never miss a moment to
            serve or celebrate with the community.
          </p>
        </section>

        <section className="announcement-section" aria-label="Parish announcements">
          {loading ? (
            <p className="announcement-muted">Loading announcements...</p>
          ) : (
            <AnnouncementList items={announcements} />
          )}
        </section>
      </main>
    </div>
  );
}
