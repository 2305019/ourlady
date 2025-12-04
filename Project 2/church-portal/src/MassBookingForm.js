// src/MassBookingForm.js
import React, { useState, useEffect } from 'react';
import './MassBookingForm.css';

const MassBookingForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    massType: '',
    intention: '',
    offeredFor: '',
    comments: '',
    name: '',
    mobile: '',
    email: '',
    captchaInput: '',
  });

  const [captchaCode, setCaptchaCode] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.captchaInput !== captchaCode) {
      alert('Incorrect Captcha');
      return;
    }
    alert('Booking submitted successfully!');
    generateCaptcha(); // refresh captcha
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form className="mass-booking-form" onSubmit={handleSubmit}>
      <h2>Mass Intention Booking – Our Lady Church</h2>

      <label>Select Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        min={minDate}
        required
      />

      <label>Select Mass</label>
      <select name="massType" value={formData.massType} onChange={handleChange} required>
        <option value="">--SELECT--</option>
        <option value="Morning Mass">Morning Mass</option>
        <option value="Evening Mass">Evening Mass</option>
      </select>

      <label>Mass Intention</label>
      <select name="intention" value={formData.intention} onChange={handleChange} required>
        <option value="">Mass Intention*</option>
        <option value="Thanksgiving">Thanksgiving</option>
        <option value="For the Departed Soul">For the Departed Soul</option>
        <option value="Special Blessing">Special Blessing</option>
      </select>

      <label>Offered for (Name)*</label>
      <input type="text" name="offeredFor" value={formData.offeredFor} onChange={handleChange} required />

      <label>Additional Comments</label>
      <textarea name="comments" value={formData.comments} onChange={handleChange} />

      <label>Name*</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Mobile No*</label>
      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />

      <label>Email ID*</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <div className="captcha-section">
        <span className="captcha-code">{captchaCode}</span>
        <input
          type="text"
          name="captchaInput"
          placeholder="Enter Captcha Here*"
          value={formData.captchaInput}
          onChange={handleChange}
          required
        />
      </div>

      <p className="warning">Please re-check all the entered details before Submitting. Changes CANNOT be made once submitted.</p>

      <button type="submit">Next</button>
    </form>
  );
};

export default MassBookingForm;