import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import axios from "axios"; 

const Header = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const { userData, setUserData } = useContext(AppContext); // ensure setUserData exists
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  useEffect(() => {
    if (statusOpen && dropdownRef.current) {
      const first = dropdownRef.current.querySelector('a,button,[tabindex]');
      first?.focus();
    }
  }, [statusOpen]);

  const toggleStatus = (e) => {
    e.stopPropagation();
    setStatusOpen((s) => !s);
  };

  const onStatusKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setStatusOpen((s) => !s);
    } else if (e.key === 'Escape') {
      setStatusOpen(false);
    }
  }; 

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUserData(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
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

  return (
    <div className="whole-thing">
      <header className="site-header">
        <div className="main-header">
          <div className="logo-area">
            <img
              className="logo-image"
              src={logo}
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="title">
            <h1 className="animated-title">Our Lady Mother Of Poor Church</h1>
          </div>

          <div className="auth-buttons-top">
            {!userData ? (
              <button className="logout" onClick={() => navigate("/login")}>Log In</button>
            ) : (
              <div className="user-menu" tabIndex="0">
                <div className="user-profile">
                  <div className="user-icon" tabIndex={0}>
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
            )}
          </div>
        </div>

        <nav className="main-nav" ref={navRef}>
          <ul className="nav-list">
            <li><NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Home</NavLink></li>
            <li><NavLink to="/association" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Association</NavLink></li>
            <li><NavLink to="/announcements" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Announcements</NavLink></li>
            <li><NavLink to="/calendar" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Calendar</NavLink></li>
            <li><NavLink to="/certificate-request" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Certificate Request</NavLink></li>
            <li><NavLink to="/massForm" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Book Mass</NavLink></li>
            <li><NavLink to="/contact" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Contact us</NavLink></li>

            <li className="status-parent">
              <button
                id="status-button"
                className={`nav-item nav-item-button ${statusOpen ? 'open' : ''}`}
                onClick={toggleStatus}
                onKeyDown={onStatusKeyDown}
                aria-expanded={statusOpen}
                aria-controls="status-dropdown"
                aria-haspopup="menu"
              >
                Check Status ▾
              </button>

              <ul id="status-dropdown" ref={dropdownRef} className={`nav-dropdown ${statusOpen ? 'show' : ''}`} role="menu" aria-labelledby="status-button">
                <li><NavLink to="/status" role="menuitem" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Mass</NavLink></li>
                <li><NavLink to="/certificate-status" role="menuitem" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>Certificate</NavLink></li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );

};

export default Header;
