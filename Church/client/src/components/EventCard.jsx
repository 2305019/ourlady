import React from 'react'
import dayjs from 'dayjs'

export default function EventCard({ ev }) {
  const start = ev.start ? dayjs(ev.start) : null
  const end = ev.end ? dayjs(ev.end) : null
  const dateText = start ? (end && end.isSame(start, 'day') ? start.format('MMM D, YYYY') : `${start.format('MMM D, YYYY')}${end ? ` — ${end.format('MMM D, YYYY')}` : ''}`) : ''

  return (
    <article className="event-card">
      <div className="event-card-left">
        <div className="event-badge">{start ? start.format('D') : ''}</div>
      </div>
      <div className="event-card-body">
        <header className="event-card-header">
          <h3 className="event-card-title">{ev.title}</h3>
          <div className="event-card-date">{dateText}</div>
        </header>
        {ev.extendedProps?.description && (
          <p className="event-card-desc">{ev.extendedProps.description}</p>
        )}
        {ev.extendedProps?.location && (
          <div className="event-card-meta">📍 {ev.extendedProps.location}</div>
        )}
      </div>
    </article>
  )
}
