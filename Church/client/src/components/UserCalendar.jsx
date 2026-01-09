import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayjs from 'dayjs'
import EventCard from './EventCard'

export default function UserCalendar({ events }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelectedDate(null)
      setSelectedEvents([])
    }
  }, [open])

  function onDateClick(info) {
    const dateStr = info.dateStr
    const matches = (events || []).filter(ev => {
      const start = dayjs(ev.start)
      const end = ev.end ? dayjs(ev.end) : dayjs(ev.start)
      const current = dayjs(dateStr)
      return current.isSame(start, 'day') || current.isSame(end, 'day') || (current.isAfter(start, 'day') && current.isBefore(end, 'day'))
    })
    setSelectedDate(dateStr)
    setSelectedEvents(matches)
    setOpen(matches.length > 0)
  }

  function onEventClick(info) {
    // Show a single event in the details panel when a user clicks an event
    const ev = info.event
    const evObj = {
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr || ev.startStr,
      extendedProps: ev.extendedProps || {}
    }
    console.log('[UserCalendar] eventClick ->', evObj)
    setSelectedDate(ev.startStr ? ev.startStr.split('T')[0] : '')
    setSelectedEvents([evObj])
    setOpen(true)
  }

  return (
    <div className="user-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={false}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        headerToolbar={{ left: 'prev,next', center: 'title', right: '' }}
      />

      <div className={`details-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="details-header">
          <strong>Events on {selectedDate}</strong>
          <button className="close" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="details-body">
          {selectedEvents.length === 0 ? (
            <div className="no-events">No events for this day.</div>
          ) : (
            selectedEvents.map(ev => (
              <EventCard key={ev.id} ev={ev} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
