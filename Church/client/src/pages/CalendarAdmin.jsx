import React, { useEffect, useState } from 'react'
import CalendarView from '../components/CalendarView'
import EventForm from '../components/EventForm'
import * as eventsApi from '../api/events'
import '../styles/calendar.css'

export default function CalendarAdmin() {
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function load() {
      const ev = await eventsApi.getEvents()
      setEvents(ev)
    }
    load()
  }, [])

  async function handleCreate(eventData) {
    try {
      console.log('[CalendarAdmin] Creating event:', eventData)
      await eventsApi.createEvent(eventData)
      const all = await eventsApi.getEvents()
      setEvents(all)
      setShowForm(false)
    } catch (err) {
      console.error('[CalendarAdmin] Create error:', err)
      const errorMessage = err.message || 'Failed to create event. Please check your connection and try again.'
      alert(`Failed to create event: ${errorMessage}`)
    }
  }

  async function handleUpdate(id, updates) {
    try {
      await eventsApi.updateEvent(id, updates)
      const all = await eventsApi.getEvents()
      setEvents(all)
      setEditing(null)
      setShowForm(false)
    } catch (err) {
      console.error(err)
      alert('Failed to update event')
    }
  }

  async function handleDelete(id) {
    try {
      await eventsApi.deleteEvent(id)
      const all = await eventsApi.getEvents()
      setEvents(all)
    } catch (err) {
      console.error(err)
      alert('Failed to delete event')
    }
  }

  function handleDateSelect(date) {
    // Check if the selected date is in the past or beyond 1 year
    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const oneYearFromToday = new Date(today)
    oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1)
    
    if (selectedDate < today) {
      alert('Cannot create event on past dates')
      return
    }
    
    if (selectedDate > oneYearFromToday) {
      alert('Events can only be created within 1 year from today')
      return
    }
    
    setEditing({ start: date })
    setShowForm(true)
  }

  return (
    <div className="app">
      <header>
        <h1>Calendar Admin</h1>
        <div className="toolbar">
          <button onClick={() => { setEditing(null); setShowForm(true) }}>+ Add Event</button>
        </div>
      </header>

      <main>
        <CalendarView
          events={events}
          onDateSelect={handleDateSelect}
          onEventClick={(event) => { setEditing(event); setShowForm(true) }}
          isAdmin={true}
        />

        {showForm && (
          <EventForm
            initial={editing}
            onCancel={() => { setShowForm(false); setEditing(null) }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}


      </main>
    </div>
  )
}
