import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import PriestCarousel from "../components/PriestCarousel";

const Home = () => {
  const priests = [
    {
      name: "Father Aidan Manuel Fernandes",
      photo: "p1",
      servicePeriod: "*Served 2023-Current*",
    },
    {
      name: "Aldrin Dcosta",
      photo: "p2",
      servicePeriod: "*Served 2023-Current*",
    },
    {
      name: "Denrish Clyde D'costa",
      photo: "p3",
      servicePeriod: "Served 2025-Current",
    },
  ];
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.role === "admin") {
      navigate("/admin-dash", { replace: true });
    }
  }, [userData, navigate]);

  return (
    <div className="home-page">
      <Header />

      <Carousel userData={userData} />
      <main className="content-container">
        <section className="intro-section">
          <h2>Introduction</h2>
          <div className="intro-content">
            <p>
              Welcome to the official website of the{" "}
              <strong>
                Society of the Missionaries of St. Francis Xavier (Society of
                Pilar)
              </strong>
              . Our congregation is consecrated to the service of the Almighty
              God and committed to carrying forward the missionary legacy of St.
              Francis Xavier. Rooted in faith and charity, we strive to bring
              the message of the Gospel to all corners of the world, with a
              special focus on serving the spiritually and materially deprived.
            </p>
            <p>
              Since our foundation, the Society has expanded its apostolate to
              include education, health care, social upliftment, and pastoral
              service across multiple continents. We invite you to explore our
              work, support our missions, and share in the joyous spirit of our
              calling.
            </p>
          </div>
        </section>

        <section className="hist-section">
          <h2>Our History and Parishes</h2>
          <div className="hist-content">
            <p>
              The Our Lady, Mother of the Poor Church, Tilamola, Goa is known as
              'Nossa Senhora, Mae Dos Pobres Igreja em Tilamola, Goa' in
              Portuguese. The Tilamola church was originally part of the Parish
              of Zambaulim. Following the suppression of the Parish of Zambaulim
              in 1858, the Tilamola Church was transferred to the newly created
              Parish of Sanguem. In <strong>1880</strong>, Our Lady, Mother of
              the Poor Church, Tilamola, Goa was officially established as a
              separate parish.
            </p>
            <p>
              The Religious Order currently associated with the Parish of
              Tilamola is the{" "}
              <strong>Daughters of the Cross of Liege (FC)</strong>, who are
              based at Priti Kiran, Xeldem, Quepem, Goa.
            </p>
          </div>
        </section>

        <section className="news-section">
          <h2 className="priest-name">Priests Who Served Our Church</h2>
          <PriestCarousel items={priests} />
        </section>
      </main>
      {!userData && (
        <div style={{ padding: "20px" }}>
          <p>Please log in to book a mass or check status.</p>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Home;
