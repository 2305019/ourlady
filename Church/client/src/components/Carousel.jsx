import React, { useState, useEffect } from 'react';
import churchWebp from '../assets/church.webp';
import church2Jpg from '../assets/church2.jpg';
import church2Jpeg from '../assets/church2.jpeg';
import image1 from '../assets/1.jpeg';
import image2 from '../assets/2.jpeg';
import image3 from '../assets/3.jpeg';

const slides = [
  {
    src: churchWebp,
    title: 'Our Church',
    description: 'Join us in worship and service.',
  },
  {
    src: church2Jpg,
    title: 'Community & Service',
    description: 'Carrying the missionary legacy across the globe.',
  },
  {
    src: church2Jpeg,
    title: 'Our Parish',
    description: 'A place of worship and community.',
  },
  {
    src: image1,
    title: 'Church Community',
    description: 'Together in faith and fellowship.',
  },
  {
    src: image2,
    title: 'Sacred Space',
    description: 'A sanctuary for prayer and reflection.',
  },
  {
    src: image3,
    title: 'Divine Worship',
    description: 'Celebrating our faith together.',
  },
];

export default function Carousel({ userData = null }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Stop auto-play when user is logged in
    if (userData) {
      return;
    }
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [userData]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return  (
  <div className="slider-wrapper">
    <div className="slider-container">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`slide ${idx === currentSlide ? "active" : ""}`}
        >
          <img src={slide.src} alt={slide.title} />
        </div>
      ))}

      {/* Prev Button */}
      <button className="slider-btn prev" onClick={handlePrev}>
        ❮
      </button>

      {/* Next Button */}
      <button className="slider-btn next" onClick={handleNext}>
        ❯
      </button>

      {/* Caption */}
      <div className="slider-caption">
        <h3>{slides[currentSlide].title}</h3>
        <p>{slides[currentSlide].description}</p>
      </div>

      {/* Dots */}
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  </div>
);

}