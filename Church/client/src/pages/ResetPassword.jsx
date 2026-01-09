import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

axios.defaults.withCredentials = true;  

const ResetPassword = () => {

  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const inputRefs = React.useRef([]);
  const [newPassword, setNewPassword] = useState('');  
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false); 

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');

    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="auth-form">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your email to receive a reset code.</p>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button">Send Reset Code</button>
          </form>
        )}

        {!isOtpSubmited && isEmailSent && (
          <form onSubmit={onSubmitOtp} className="auth-form">
            <h1 className="auth-title">Enter OTP</h1>
            <p className="auth-subtitle">Check your email and enter the 6‑digit code.</p>
            <div className="otp-row" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={e => inputRefs.current[index] = e}
                  onInput={e => handleInput(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="otp-input"
                />
              ))}
            </div>
            <button type="submit" className="auth-button">Verify Code</button>
          </form>
        )}

        {isOtpSubmited && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="auth-form">
            <h1 className="auth-title">New Password</h1>
            <p className="auth-subtitle">Choose a strong password to secure your account.</p>
            <div className="auth-field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button">Update Password</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
