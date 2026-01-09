import React from 'react'

export default function AnnouncementCard({ title, date, summary, _id }) {
  return (
    <article className="announcement-card">
      <div className="announcement-card__side">
        <time className="announcement-card__date">
          {new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      </div>
      <div className="announcement-card__main">
        <h3 className="announcement-card__title">{title}</h3>
        {summary && <p className="announcement-card__summary">{summary}</p>}
      </div>
    </article>
  )
}
