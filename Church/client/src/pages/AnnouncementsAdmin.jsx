import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AdminPanel from '../components/AdminPanel'
import AnnouncementList from '../components/AnnouncementList'
import * as announcementsApi from '../api/announcements'
import '../styles/announcements.css'

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  async function loadAnnouncements() {
    try {
      const data = await announcementsApi.getAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAnnouncementCreated() {
    loadAnnouncements()
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="content-container">
        <section className="admin-section">
          <AdminPanel onAnnouncementCreated={handleAnnouncementCreated} />
        </section>

        <section className="announcement-section">
          <h2>All Announcements</h2>
          {loading ? (
            <p className="announcement-muted">Loading announcements...</p>
          ) : (
            <AnnouncementList items={announcements} />
          )}
        </section>
      </main>
    </div>
  )
}
