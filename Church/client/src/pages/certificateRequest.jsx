import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";

const CertificateRequest = () => {
  const navigate = useNavigate();
  const todayDate = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  };
  const isFutureDate = (ds) => {
    if (!ds) return false;
    return new Date(ds) > todayDate();
  };

  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    certificateType: "",

    requestPurpose: "",
    requesterName: "",
    requesterRelation: "",

    dateOfBaptism: "",
    fatherName: "",
    motherName: "",
    groomsName: "",

    bridesName: "",

    dateOfMarriage: "",
    marriageRegNo: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
    if (name === "dob" && isFutureDate(value)) {
      toast.error("Date of Birth cannot be in the future");
      return;
    }
  };

  useEffect(() => {
    setFormData((prev) => {
      if (prev.certificateType === "BAPTISM") {
        return {
          ...prev,
          groomsName: "",

          bridesName: "",

          dateOfMarriage: "",
          marriageRegNo: "",
        };
      }

      if (prev.certificateType === "MARRIAGE") {
        return {
          ...prev,
          dateOfBaptism: "",
          fatherName: "",
          motherName: "",
        };
      }

      return prev;
    });
  }, [formData.certificateType]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/certificate/request",
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
      toast.message(error.message);
    }
  };

  return (
    <>
    <Header/>
      <div className="certificate-form-container">
        <form className="certificate-form" onSubmit={submitHandler}>
          <h2>Certificate Request</h2>
          
          <label className="mass-form-label">Certificate Type *</label>
          <select name="certificateType" onChange={handleChange} required>
            <option value="">Select type</option>
            <option value="BAPTISM">BAPTISM</option>
            <option value="MARRIAGE">MARRIAGE</option>
          </select>

          <label className="mass-form-label">Requester's Name *</label>
          <input
            type="text"
            name="requesterName"
            onChange={handleChange}
            placeholder="Enter requester's name"
            className="certificate-requesterName"
            required
          />
          
          <label className="mass-form-label">Request Purpose *</label>
          <input
            type="text"
            name="requestPurpose"
            onChange={handleChange}
            placeholder="Enter purpose"
            className="certificate-requestPurpose"
            required
          />

          <label className="mass-form-label">Requester Relation *</label>
          <input
            name="requesterRelation"
            type="text"
            onChange={handleChange}
            placeholder="Enter relation"
            className="certificate-requester-relation"
            required
          />
         

          {formData.certificateType === "BAPTISM" && (
            <>
              <label className="mass-form-label">Date of Baptism</label>
              <input
                name="dateOfBaptism"
                type="date"
                onChange={handleChange}
                className="certificate-date-baptism"
              />

              <label className="mass-form-label">Father's Name *</label>
              <input
                name="fatherName"
                type="text"
                onChange={handleChange}
                placeholder="Enter father's name"
                className="baptism-father-name"
                required
              />
              
              <label className="mass-form-label">Mother's Name *</label>
              <input
                name="motherName"
                type="text"
                onChange={handleChange}
                placeholder="Enter mother's name"
                className="baptism-mother-name"
                required
              />
            </>
          )}

          {formData.certificateType === "MARRIAGE" && (
            <>
              <label className="mass-form-label">Groom's Name *</label>
              <input
                name="groomsName"
                type="text"
                onChange={handleChange}
                placeholder="Enter groom's name"
                className="Marriage-groom-name"
                required
              />

              <label className="mass-form-label">Bride's Name *</label>
              <input
                name="bridesName"
                type="text"
                onChange={handleChange}
                placeholder="Enter bride's name"
                className="Marriage-bride-name"
                required
              />
              
              <label className="mass-form-label">Date of Marriage</label>
              <input
                name="dateOfMarriage"
                className="date-of-marriage"
                type="date"
                onChange={handleChange}
              />
              
              <label className="mass-form-label">Marriage Registration Number *</label>
              <input
                name="marriageRegNo"
                type="number"
                onChange={handleChange}
                placeholder="Enter registration number"
                className="Marriage-reg-no"
                required
              />
            </>
          )}

          <button type="submit" className="cert-form-submit">
            Submit Request
          </button>
        </form>
      </div>
    
    </>
  );
};

export default CertificateRequest;