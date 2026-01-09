import React, { useEffect, useState } from "react";
import p1 from '../assets/p1.png';
import p2 from '../assets/p2.png';
import p3 from '../assets/p3.png';

const PriestCarousel = ({ items = [] }) => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Map photo strings to actual image imports
  const getPhotoSrc = (photo) => {
    if (!photo) return null;
    const photoMap = {
      'p1': p1,
      'p2': p2,
      'p3': p3,
      'p1.png': p1,
      'p2.png': p2,
      'p3.png': p3,
    };
    return photoMap[photo] || photo;
  };

  useEffect(() => {
    if (!items.length) return undefined;
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setIsAnimating(false);
      }, 300);
    }, 3200);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const go = (delta) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + delta + items.length) % items.length);
      setIsAnimating(false);
    }, 300);
  };

  const current = items[index];
  const photoSrc = getPhotoSrc(current.photo);

  return (
    <div className="priest-carousel">
      <div className="priest-track">
        <article className={`priest-card glass-card ${isAnimating ? 'priest-card-animating' : ''}`}>
          <div className="priest-meta">
            <span className="priest-pill">Priest</span>
            <span className="priest-count">
              {index + 1}/{items.length}
            </span>
          </div>

          <div className="priest-photo-frame">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt={current.name}
                className="priest-photo-img"
              />
            ) : (
              <div className="priest-photo-placeholder" />
            )}
          </div>

          <h3 className="priest-name-title">{current.name}</h3>
          <p className="priest-description">{current.servicePeriod || current.description}</p>
        </article>
      </div>

      <div className="priest-controls">
        <button className="priest-nav" onClick={() => go(-1)} aria-label="Previous priest">
          ‹
        </button>
        <button className="priest-nav" onClick={() => go(1)} aria-label="Next priest">
          ›
        </button>
      </div>

      <div className="priest-dots" aria-label="Priest selection">
        {items.map((_, dotIdx) => (
          <button
            key={dotIdx}
            className={`priest-dot ${dotIdx === index ? "active" : ""}`}
            onClick={() => setIndex(dotIdx)}
            aria-label={`View priest ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PriestCarousel;
