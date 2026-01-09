import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AdminCertDash = () => {
  const { backendUrl } = useContext(AppContext);
  const [certs, setCerts] = useState([]);
  const [remarks, setRemarks] = useState({});

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/certificate/admin/status",
        { withCredentials: true }
      );

      if (data.success) {
        setCerts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load certificates");
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const updateStatus = async (certificateId, status) => {
    try {
      const remark = remarks[certificateId] || "";

      if (status === "rejected" && !remark) {
        return toast.error("Remark required for rejection");
      }

      const { data } = await axios.patch(
        backendUrl + "/api/certificate/admin/update-status",
        { certificateId, status, remark },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCertificates();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const uploadPdf = async (certificateId, file) => {
    const formData = new FormData();
    formData.append("certificateId", certificateId);
    formData.append("certificate", file);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/certificate/admin/upload-pdf",
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCertificates();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("PDF upload failed");
    }
  };

  return (
    <div className="admin-cert-container">
      <h1 className="admin-cert-title">Certificate Requests (Admin)</h1>

      {certs.length === 0 ? (
        <p>No certificate requests</p>
      ) : (
        <ul className="admin-cert-list">
          {/* HEADER */}
          <li className="admin-cert-header">
            <span>Requester</span>
            <span>Purpose</span>
            <span>User Email</span>
            <span>Type</span>
            <span>Status</span>
            <span>Remark</span>
            <span>Action</span>
            <span>Upload</span>
          </li>

          {/* ROWS */}
          {certs.map((cert) => (
            <li className="admin-cert-row" key={cert._id}>
              <span>{cert.requesterName}</span>
              <span>{cert.requestPurpose}</span>
              <span>{cert.user?.email}</span>
              <span>{cert.certificateType}</span>

              <span className={`admin-cert-status ${cert.status}`}>
                {cert.status}
              </span>

              <span>
                {cert.status === "pending" ? (
                  <input
                    type="text"
                    placeholder="Remark (required for reject)"
                    value={remarks[cert._id] || ""}
                    onChange={(e) =>
                      setRemarks({
                        ...remarks,
                        [cert._id]: e.target.value,
                      })
                    }
                  />
                ) : (
                  cert.remark || "—"
                )}
              </span>

              <span className="admin-cert-actions">
                {cert.status === "pending" ? (
                  <>
                    <button onClick={() => updateStatus(cert._id, "approved")}>
                      Approve
                    </button>
                    <button onClick={() => updateStatus(cert._id, "rejected")}>
                      Reject
                    </button>
                  </>
                ) : (
                  "—"
                )}
              </span>

              <span>
                {/* Waiting for payment */}
                {cert.status === "approved" &&
                  cert.paymentStatus === "pending" && (
                    <span className="admin-wait-payment">Awaiting payment</span>
                  )}

                {/* Allow upload only after payment */}
                {cert.status === "approved" &&
                  cert.paymentStatus === "paid" &&
                  !cert.certificatePdf && (
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => uploadPdf(cert._id, e.target.files[0])}
                    />
                  )}

                {/* View uploaded PDF */}
                {cert.certificatePdf && (
                  <a
                    href={`${backendUrl}/${cert.certificatePdf}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PDF
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminCertDash;
