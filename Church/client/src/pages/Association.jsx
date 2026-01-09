import React, { useState } from "react";
import Header from "../components/Header";

const associations = [
  {
    id: 1,
    name: "Catechetical Association",
    description: "Dedicated to religious education and spiritual formation for all ages.",
    color: "#2196F3",
    icon: "📚",
    images: [
      "https://via.placeholder.com/800x600/2196F3/ffffff?text=Catechetical+1",
      "https://via.placeholder.com/800x600/2196F3/ffffff?text=Catechetical+2",
      "https://via.placeholder.com/800x600/2196F3/ffffff?text=Catechetical+3",
    ],
  },
  {
    id: 2,
    name: "Youth Association",
    description: "A vibrant community for young people to grow in faith and character.",
    color: "#4CAF50",
    icon: "🎯",
    images: [
      "https://via.placeholder.com/800x600/4CAF50/ffffff?text=Youth+1",
      "https://via.placeholder.com/800x600/4CAF50/ffffff?text=Youth+2",
    ],
  },
  {
    id: 3,
    name: "Altar Server Association",
    description: "Training and coordinating dedicated altar servers for our liturgical celebrations.",
    color: "#F44336",
    icon: "⛪",
    images: [
      "https://via.placeholder.com/800x600/F44336/ffffff?text=Altar+Server+1",
      "https://via.placeholder.com/800x600/F44336/ffffff?text=Altar+Server+2",
      "https://via.placeholder.com/800x600/F44336/ffffff?text=Altar+Server+3",
    ],
  },
  {
    id: 4,
    name: "Charismatic Association",
    description: "Experiencing the gifts of the Holy Spirit through prayer and spiritual renewal.",
    color: "#FFC107",
    icon: "⭐",
    images: [
      "https://via.placeholder.com/800x600/FFC107/000000?text=Charismatic+1",
      "https://via.placeholder.com/800x600/FFC107/000000?text=Charismatic+2",
    ],
  },
];

export default function Association() {
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageModal = (association) => {
    setSelectedAssociation(association);
    setCurrentImageIndex(0);
  };

  const closeImageModal = () => {
    setSelectedAssociation(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAssociation) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedAssociation.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedAssociation) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedAssociation.images.length) %
          selectedAssociation.images.length
      );
    }
  };

  return (
    <>
      <Header />
      <div className="page-shell association-page">
        <main className="content-container">
          <section className="association-hero">
            <h2 className="association-title">Our Associations</h2>
            <div className="association-underline"></div>
            <p className="association-intro">
              Our church community is enriched by several active associations.
              Each association plays a vital role in deepening our faith and
              fostering community. Join any of these meaningful groups and become
              part of our parish family.
            </p>
          </section>

          <section className="association-grid">
            {associations.map((association) => (
              <div key={association.id} className="association-card">
                <div
                  className="association-card-header"
                  style={{ backgroundColor: association.color }}
                >
                  <div className="association-icon">{association.icon}</div>
                </div>
                <div className="association-card-body">
                  <h3
                    className="association-card-title"
                    style={{ color: association.color }}
                  >
                    {association.name}
                  </h3>
                  <p className="association-card-description">
                    {association.description}
                  </p>
                  <button
                    className="association-learn-more"
                    style={{ backgroundColor: association.color }}
                    onClick={() => openImageModal(association)}
                  >
                    View Images
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* Image Modal */}
        {selectedAssociation && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="image-modal-close" onClick={closeImageModal}>
                ×
              </button>
              <div className="image-modal-header">
                <h3>{selectedAssociation.name}</h3>
                <span className="image-counter">
                  {currentImageIndex + 1} / {selectedAssociation.images.length}
                </span>
              </div>
              <div className="image-modal-image-container">
                <button
                  className="image-modal-nav image-modal-prev"
                  onClick={prevImage}
                >
                  ❮
                </button>
                <img
                  src={selectedAssociation.images[currentImageIndex]}
                  alt={`${selectedAssociation.name} ${currentImageIndex + 1}`}
                  className="image-modal-image"
                />
                <button
                  className="image-modal-nav image-modal-next"
                  onClick={nextImage}
                >
                  ❯
                </button>
              </div>
              <div className="image-modal-dots">
                {selectedAssociation.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`image-modal-dot ${
                      idx === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
