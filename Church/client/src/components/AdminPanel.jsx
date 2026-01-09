import React, { useState } from 'react'
import * as announcementsApi from '../api/announcements'

export default function AdminPanel({ onAnnouncementCreated }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('saving')
    setError('')
    
    try {
      // Validation
      if (!title || title.trim() === '') {
        setError('Title is required')
        setStatus(null)
        return
      }

      if (title.length > 200) {
        setError('Title cannot exceed 200 characters')
        setStatus(null)
        return
      }

      if (summary && summary.length > 1000) {
        setError('Summary cannot exceed 1000 characters')
        setStatus(null)
        return
      }

      const payload = {
        title: title.trim(),
        date: date || new Date().toISOString().split('T')[0],
        summary: summary ? summary.trim() : ''
      }

      await announcementsApi.createAnnouncement(payload)
      
      setTitle('')
      setDate('')
      setSummary('')
      setStatus('saved')
      
      // Notify parent component to refresh list
      if (onAnnouncementCreated) {
        onAnnouncementCreated()
      }
      
      // Clear success message after 2 seconds
      setTimeout(() => setStatus(null), 2000)
    } catch (err) {
      setError(err.message || 'Failed to save announcement')
      setStatus('error')
    }
  }

  return (
    <section className="admin-panel">
      <h3 className="admin-title">Admin — Add Announcement</h3>
      {error && <div className="admin-error" style={{color: 'red', marginBottom: '8px'}}>{error}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Title" 
          required 
          maxLength={200}
        />
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
        />
        <textarea 
          value={summary} 
          onChange={e => setSummary(e.target.value)} 
          placeholder="Short summary (optional)"
          maxLength={1000}
        />
        <div className="admin-actions">
          <button className="btn" type="submit">Save</button>
          {status === 'saving' && <span className="announcement-muted">Saving...</span>}
          {status === 'saved' && <span className="announcement-muted">Saved ✓</span>}
          {status === 'error' && <span className="announcement-muted">Error saving</span>}
        </div>
      </form>
    </section>
  )
}
