import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarView({ events, onDateSelect, onEventClick, isAdmin }) {
  // compute cutoff: one year ago (start of day)
  const oneYearAgo = new Date()
  oneYearAgo.setHours(0, 0, 0, 0)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={(info) => {
          if (isAdmin) {
            const cellDate = new Date(info.startStr)
            cellDate.setHours(0, 0, 0, 0)
            if (cellDate < oneYearAgo) {
              // Prevent admin from selecting a date older than 1 year
              alert('Cannot create or edit events more than 1 year in the past')
              return
            }
          }
          onDateSelect(info.startStr)
        }}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        events={events}
        dayCellClassDidMount={(info) => {
          if (isAdmin) {
            const cellDate = info.date
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // mark days in the past
            if (cellDate < today) {
              // mark very old (more than 1 year ago) differently
              if (cellDate < oneYearAgo) {
                info.el.classList.add('very-old-admin')
              } else {
                info.el.classList.add('past-date-admin')
              }
            }
          }
        }}
        eventClick={(info) => {
          const ev = info.event
          const evStart = ev.start ? new Date(ev.start) : null
          if (isAdmin && evStart) {
            evStart.setHours(0, 0, 0, 0)
            if (evStart < oneYearAgo) {
              alert('This event is older than 1 year and cannot be edited')
              return
            }
          }

          onEventClick({
            id: ev.id,
            title: ev.title,
            start: ev.startStr,
            end: ev.endStr || ev.startStr,
            extendedProps: ev.extendedProps
          })
        }}
      />
    </div>
  )
}
