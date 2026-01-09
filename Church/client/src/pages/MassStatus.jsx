import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const MassStatus = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [masses, setMasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/book/status", {
          withCredentials: true,
        });

        if (data.success) {
          setMasses(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch mass status"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [backendUrl]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-shell">
      <Header />
      <div className="mass-status-container">
      <h2 className="statush2" style={{ color: "white" }}>
        My Mass Bookings
      </h2>

      {masses.length === 0 ? (
        <p className="mass-status-empty">No bookings found</p>
      ) : (
        <ul className="mass-status-list">
          
          <li className="mass-status-header">
            <span>Offered For</span>
            <span>Mass Type</span>
            <span>Date</span>
            <span>Status</span>
            <span>remark</span>
          </li>

          {masses.map((mass, index) => (
            <li className="mass-status-item" key={index}>
              <span className="offer-for-name">{mass.offerForName}</span>

              <span className="mass-type">
                {mass.massType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>

              <span className="mass-Date">
                {new Date(mass.preferedDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className={`status-badge status-${mass.status}`}>
                {mass.status}
              </span>
              <span className={`Mass-Remark-${mass.adminRemark}`}>
                {mass.adminRemark}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default MassStatus;
