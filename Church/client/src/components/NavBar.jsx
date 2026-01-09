import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import MassBookingForm from "../pages/massBookingForm";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData } = useContext(AppContext);
  if (userData?.role === "admin") {
    return null;
  }

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setUserData(null);
        navigate("/login");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "flex-start", padding: "15px" }}
    >
      {!userData ? (
        <button onClick={() => navigate("/login")}>Login</button>
      ) : (
        <>
          <div>
            <h1 className="title">Our Lady Of Poor Church</h1>
          </div>
          <div className="user-menu" tabIndex="0">
            <div className="user-profile">
              <div className="user-icon">
                {userData.name.charAt(0).toUpperCase()}
              </div>

              <ul className="dropdown">
                {!userData.isVerified && (
                  <li onClick={sendVerificationOtp}>Verify Email</li>
                )}
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
