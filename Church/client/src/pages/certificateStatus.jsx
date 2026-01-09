import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const CertificateStatus = () => {
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificateStatus = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/certificate/status",
        { withCredentials: true }
      );

      if (data.success) {
        setCertificates(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateStatus();
  }, []);

  if (loading) return <p>Loading...</p>;
  const payNow = async (certificateId) => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/certificate/pay",
      { certificateId },
      { withCredentials: true }
    );

    if (data.success) {
      toast.success(data.message);
      fetchCertificateStatus();
    } else {
      toast.error(data.message);
    }
  } catch {
    toast.error("Payment failed");
  }
};

  return (
    <div className="page-shell">
      <Header />
      <div className="user-cert-container">
      <h2 className="user-cert-title">My Certificate Requests</h2>

      {certificates.length === 0 ? (
        <p className="user-cert-empty">No certificate requests found</p>
      ) : (
        <ul className="user-cert-list">

          {/* HEADER */}
          <li className="user-cert-header">
            <span>Type</span>
            <span>Purpose</span>
            <span>Status</span>
            <span>Remark</span>
            <span>Payment</span>
            <span>Certificate</span>
          </li>

          {/* ROWS */}
          {certificates.map((cert) => (
            <li className="user-cert-row" key={cert._id}>

              <span className="user-cert-type">
                {cert.certificateType}
              </span>

              <span className="user-cert-purpose">
                {cert.requestPurpose}
              </span>

              <span
                className={`user-cert-status user-cert-${cert.status}`}
              >
                {cert.status}
              </span>

              <span className="user-cert-remark">
                {cert.remark || "—"}
              </span>
              <span className="pay-now-button">

{cert.status === "approved" && cert.paymentStatus === "pending" && (
  <button
    className="user-cert-pay"
    onClick={() => payNow(cert._id)}
  >
    Pay Now
  </button>
)}
              </span>

              <span className="user-cert-download">
                {cert.certificatePdf ? (
                  <a
                    href={`${backendUrl}/${cert.certificatePdf}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download PDF
                  </a>
                ) : cert.status === "approved" ? (
                  <span className="user-cert-wait">
                    Awaiting upload
                  </span>
                ) : (
                  "—"
                )}
              </span>

            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default CertificateStatus;
