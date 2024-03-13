import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './appointment_details.css'; // Import CSS file for styling

const AppointmentDetailsPage = () => {
  const location = useLocation();
  const { doctor, user, slotDate, slotTime } = location.state;

  return (
    <div className="appointment-details-container">
      <div className="confirmation-header">
        <img src="https://imgs.search.brave.com/7yxPe3EL-ykp7TAsWxycb-3bCLHWnqdjgrzXfjXHCLo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzU3Lzg2LzQ0/LzM2MF9GXzE1Nzg2/NDQ4MF9URm0xblFz/VUkxbzhWTEtnNlNL/NnlWOVA2dHNLNFRY/Ti5qcGc" alt="Green Tick" className="confirmation-icon" />
        <h2>Appointment Confirmed!</h2>
      </div>
      <div className="details-container">
        <div className="section">
          <h3>Doctor Details</h3>
          <div className="detail-box">
            <p className="detail-label">Doctor Name:</p>
            <p className="detail-value">{doctor.doc_name}</p>
          </div>
          <div className="detail-box">
            <p className="detail-label">Qualification:</p>
            <p className="detail-value">{doctor.doc_qualification}</p>
          </div>
          <div className="detail-box">
            <p className="detail-label">Specialization:</p>
            <p className="detail-value">{doctor.doc_specification}</p>
          </div>
        </div>
        <div className="section">
          <h3>Patient Details</h3>
          <div className="detail-box">
            <p className="detail-label">Patient Name:</p>
            <p className="detail-value">{user.username}</p>
          </div>
          <div className="detail-box">
            <p className="detail-label">Gender:</p>
            <p className="detail-value">{user.gender}</p>
          </div>
          {/* Add other user details as needed */}
        </div>
        <div className="section">
          <h3>Appointment Details</h3>
          <div className="detail-box">
            <p className="detail-label">Date:</p>
            <p className="detail-value">{slotDate}</p>
          </div>
          <div className="detail-box">
            <p className="detail-label">Time:</p>
            <p className="detail-value">{slotTime}</p>
          </div>
        </div>
      </div>
      <Link to="/home" className="go-back-link">Go Back Home</Link>
    </div>
  );
};

export default AppointmentDetailsPage;
