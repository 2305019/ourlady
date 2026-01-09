import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminDash = () => {
  const [masses, setMasses] = useState([]);
  const { backendUrl, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState({});
  const fetchMassData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/book/admin/status", {
        withCredentials: true,
      });

      if (data.success) {
        setMasses(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load data");
    }
  };
  const logout = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(null);
        navigate("/login", { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    fetchMassData();
  }, [backendUrl]);

  const updateStatus = async (massId, status) => {
    const remark = remarks[massId] || "";

    if (status === "rejected" && !remark) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      const { data } = await axios.patch(
        backendUrl + "/api/book/admin/update-status",
        { massId, status, remark },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        fetchMassData();





        setRemarks((prev) => {
          const copy = { ...prev };
          delete copy[massId];
          return copy;
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="admin-mass-container">
      <li className="admin-logout" onClick={logout}>
        <span>Logout</span>
      </li>
            <li className="admin-logout" onClick={()=>navigate('/admin-certificate')}>
        <span>Certificates</span>
      </li>

      <h1 className="admin-mass-title">Mass Bookings (Admin)</h1>

      {masses.length === 0 ? (
        <p className="admin-mass-empty">No masses booked</p>
      ) : (
        <ul className="admin-mass-list">
          
          <li className="admin-mass-header">
            <span>Offered For</span>
            <span>User's Email</span>
            <span>Mass Type</span>
            <span>Prefered Date</span>
            <span>Status</span>
            <span>Action</span>
            <span>Remark</span>
          </li>


          {masses.map((mass) => (
            <li className="admin-mass-row" key={mass._id}>
              <span className="admin-offer-name">{mass.offerForName}</span>
              <span className="admin-user-email">{mass.user?.email}</span>
              <span className="admin-mass-type">
                {mass.massType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>

              <span className="admin-mass-date">
                {new Date(mass.preferedDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span className={`admin-status admin-status-${mass.status}`}>
                {mass.status}
              </span>
              <span className="admin-actions">
                {mass.status === "pending" ? (
                  <>
                    <button
                      className="admin-approve-btn"
                      onClick={() => updateStatus(mass._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="admin-reject-btn"
                      onClick={() => updateStatus(mass._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="admin-status-locked">—</span>
                )}
              </span>

              <span>
                {mass.status === "pending" && (
                  <input
                    type="text"
                    className="admin-remark-input"
                    placeholder="Add remark (required for reject)"
                    value={remarks[mass._id] || ""}
                    onChange={(e) =>
                      setRemarks({ ...remarks, [mass._id]: e.target.value })
                    }
                  />
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDash;
