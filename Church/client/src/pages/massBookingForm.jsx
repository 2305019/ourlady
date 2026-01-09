import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";

const MassBookingForm = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const todayISO = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < todayISO();
};

const isFutureDate = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) > todayISO();
};

const isFutureYear = (year) => {
  if (!year) return false;
  return Number(year) > new Date().getFullYear();
};

  const [formData, setFormData] = useState({
    massType: "",
    offerForName: "",
    offerByName: "",
    email: "",
    preferedDate: "",
    preferedTime: "",
    yearOfMarriage: "",
    dob: "",
    age: "",
    relationToDeceased: "",
    yearSinceDeath: "",
    dateOfDeath: "",
  });

  
const calculateAge = (dob, referenceDate) => {
  if (!dob || !referenceDate) return "";

  const birthDate = new Date(dob);
  const refDate = new Date(referenceDate);

  let years = refDate.getFullYear() - birthDate.getFullYear();
  let months = refDate.getMonth() - birthDate.getMonth();
  let days = refDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 1) {
    if (months < 0) months = 0;
    return `${months} month${months !== 1 ? "s" : ""} old`;
  }

  return years;
};



  
const handleChange = (e) => {
  const { name, value } = e.target;

  
  if (name === "preferedDate" && isPastDate(value)) {
    toast.error("Mass date cannot be in the past");
    return;
  }

  
  if (name === "dob" && isFutureDate(value)) {
    toast.error("Date of birth cannot be in the future");
    return;
  }

  
  if (name === "dateOfDeath" && isFutureDate(value)) {
    toast.error("Date of death cannot be in the future");
    return;
  }

  
  if (
    (name === "yearOfMarriage" || name === "yearSinceDeath") &&
    isFutureYear(value)
  ) {
    toast.error("Year cannot be in the future");
    return;
  }

  setFormData((prev) => {
    const updated = { ...prev, [name]: value };

    
    if (
      updated.massType === "BIRTHDAY" &&
      (name === "dob" || name === "preferedDate")
    ) {
      updated.age = calculateAge(updated.dob, updated.preferedDate);
    }

    return updated;
  });
};


  
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      yearOfMarriage:
        prev.massType === "WEDDINGANNIVERSARY" ? prev.yearOfMarriage : "",
      dob: prev.massType === "BIRTHDAY" ? prev.dob : "",
      age: prev.massType === "BIRTHDAY" ? prev.age : "",
      relationToDeceased:
        prev.massType === "MONTHMIND" ? prev.relationToDeceased : "",
      yearSinceDeath:
        prev.massType === "DEATHANNIVERSARY" ? prev.yearSinceDeath : "",
      dateOfDeath: prev.massType === "DEATHANNIVERSARY" ? prev.dateOfDeath : "",
    }));
  }, [formData.massType]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/book/massForm",
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
        <Header/>
      <div className="mass-form-container">
        <form
          onSubmit={submitHandler}
          className="mass-form"
          style={{ maxWidth: 400 }}
        >
          <h2 className="mass-form-title">Mass Booking</h2>

          <label className="mass-form-label">Mass Type *</label>
          <select
            name="massType"
            onChange={handleChange}
            required
            className="mass-form-field"
          >
            <option value="">Select Mass Type</option>
            <option value="BIRTHDAY">Birthday</option>
            <option value="WEDDINGANNIVERSARY">Wedding Anniversary</option>
            <option value="MONTHMIND">Month Mind</option>
            <option value="DEATHANNIVERSARY">Death Anniversary</option>
          </select>

          <label className="mass-form-label">Offer For Name *</label>
          <input
            name="offerForName"
            placeholder="Enter name"
            onChange={handleChange}
            required
            className="mass-form-field"
          />

          <label className="mass-form-label">Offer By Name *</label>
          <input
            name="offerByName"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className="mass-form-field"
          />

          <label className="mass-form-label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email (optional)"
            onChange={handleChange}
            className="mass-form-field"
          />

          <label className="mass-form-label">Preferred Date *</label>
          <p className="mass-form-hint">
            This is the date on which the mass will be offered
          </p>
          <input
            name="preferedDate"
            type="date"
            onChange={handleChange}
            required
            className="mass-form-field"
          />

          <label className="mass-form-label">Preferred Time *</label>
          <select
            name="preferedTime"
            onChange={handleChange}
            required
            className="mass-form-field"
          >
            <option value="">Select Preferred Time</option>
            <option value="06:30AM-07:15AM">06:30AM–07:15AM</option>
          </select>

          {formData.massType === "WEDDINGANNIVERSARY" && (
            <>
              <label className="mass-form-label">Year of Marriage *</label>
              <input
                name="yearOfMarriage"
                placeholder="Enter year"
                onChange={handleChange}
                required
                className="mass-form-field"
              />
            </>
          )}

          {formData.massType === "BIRTHDAY" && (
            <>
              <label className="mass-form-label">Date of Birth *</label>
              <input
                name="dob"
                type="date"
                onChange={handleChange}
                required
                className="mass-form-field"
              />

              <label className="mass-form-label">Age on Mass Date</label>
              <input
                type="text"
                value={formData.age || ""}
                placeholder="Calculated automatically"
                readOnly
                className="mass-form-field mass-form-readonly"
              />
            </>
          )}

          {formData.massType === "MONTHMIND" && (
            <>
              <label className="mass-form-label">Relation to Deceased *</label>
              <input
                name="relationToDeceased"
                placeholder="Enter relation"
                onChange={handleChange}
                required
                className="mass-form-field"
              />
            </>
          )}

          {formData.massType === "DEATHANNIVERSARY" && (
            <>
              <label className="mass-form-label">Years Since Death *</label>
              <input
                name="yearSinceDeath"
                placeholder="Enter years"
                onChange={handleChange}
                required
                className="mass-form-field"
              />
              <label className="mass-form-label">Date of Death *</label>
              <input
                name="dateOfDeath"
                type="date"
                onChange={handleChange}
                required
                className="mass-form-field"
              />
            </>
          )}

          <button type="submit" className="mass-form-submit">
            Submit Booking
          </button>
        </form>

      </div>
                    
    </>
  );
};

export default MassBookingForm;
