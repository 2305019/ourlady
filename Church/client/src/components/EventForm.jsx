import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function EventForm({ initial, onCancel, onCreate, onUpdate, onDelete }) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    console.log('[EventForm] initial prop', initial)
    if (initial) {
      setTitle(initial.title || '')
      setStart(initial.start || initial.startStr || '')

      // If the event end is provided as FullCalendar-exclusive end (e.g. 2026-01-09) but
      // the user expects to edit the inclusive date (e.g. 2026-01-08), convert it for display.
      const isDateOnly = (s) => typeof s === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s)
      if (initial.end && isDateOnly(initial.end) && isDateOnly(initial.start || initial.startStr || '')) {
        // subtract 1 day to show the inclusive end date in the form
        setEnd(dayjs(initial.end).subtract(1, 'day').format('YYYY-MM-DD'))
      } else {
        setEnd(initial.end || '')
      }

      setDescription(initial.extendedProps?.description || '')
    } else {
      // clear when opening fresh
      setTitle('')
      setStart('')
      setEnd('')
      setDescription('')
    }
  }, [initial])

  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log('[EventForm] submit state', { title, start, end, description })
    setError('')
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Check if start date is in the past
    if (start < today) {
      setError('Event start date cannot be in the past')
      return
    }
    
    // Check if start date is beyond 1 year from today
    const startDate = new Date(start)
    const todayDate = new Date(today)
    const oneYearFromToday = new Date(todayDate)
    oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1)
    
    if (startDate > oneYearFromToday) {
      setError('Events can only be created within 1 year from today')
      return
    }
    
    // basic validation: end must not be before start
    if (end && end < start) {
      setError('End date cannot be before start date')
      return
    }

    const payload = { title, start, end: end || start, extendedProps: { description } }
    if (initial && initial.id) {
      onUpdate(initial.id, payload)
    } else {
      onCreate(payload)
    }
  }

  function handleDelete() {
    if (!initial || !initial.id) return
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete(initial.id)
    }
  }

  function handleCancel() {
    // clear local state and notify parent to close the modal
    setTitle('')
    setStart('')
    setEnd('')
    setDescription('')
    if (onCancel) onCancel()
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handleCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}>
      <form className="event-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2>{initial && initial.id ? 'Edit Event' : 'Create Event'}</h2>
        {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}

        <label>Title</label>
        <input autoFocus value={title} onChange={e => { console.log('[EventForm] title', e.target.value); setTitle(e.target.value) }} required />

        <label>Start</label>
        <input type="date" value={start} onChange={e => { console.log('[EventForm] start', e.target.value); setStart(e.target.value) }} required />

        <label>End</label>
        <input type="date" value={end} onChange={e => { console.log('[EventForm] end', e.target.value); setEnd(e.target.value) }} />

        <label>Description</label>
        <textarea value={description} onChange={e => { console.log('[EventForm] description', e.target.value); setDescription(e.target.value) }} />

        <div className="controls">
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
          {initial && initial.id && (
            <button type="button" className="danger" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </form>
    </div>
  )
}
