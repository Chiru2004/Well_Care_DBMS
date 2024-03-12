import React from 'react';
import { useLocation} from 'react-router-dom';
import axios from 'axios';
import './confirmappointment.css'; // Import CSS file for styling

const ConfirmAppointmentPage = () => {
  const location = useLocation();
  const { doctor, user, slotDate, slotTime } = location.state;

  const handleConfirmAppointment = async () => {
    try {
      // Call the backend endpoint to confirm the appointment
      await axios.post('http://localhost:3001/api/confirmappointment', {
        patientId: user.patient_id,
        doctorId: doctor.doc_id,
        appointmentTime: slotTime,
        appointmentDate: slotDate,
      });
      alert("succes");// If the appointment is confirmed successfully, redirect to a success page
    } catch (error) {
      console.error('Error confirming appointment:', error);
      // Handle error, show a message to the user, etc.
    }
  };

  return (
    <div className="confirm-container">
      <h2>Confirm Appointment</h2>
      <div className="details-container">
        <div className="section">
          <h3>Doctor Details</h3>
          <p>Doctor Name: {doctor.doc_name}</p>
          <p>Qualification: {doctor.doc_qualification}</p>
          <p>Specialization: {doctor.doc_specification}</p>
        </div>
        <div className="section">
          <h3>Patient Details</h3>
          <p>Patient_Name: {user.username}</p>
          <p>Gender: {user.gender}</p>
          {/* Add other user details as needed */}
        </div>
        <div className="section">
          <h3>Appointment Details</h3>
          <p>Date: {slotDate}</p>
          <p>Time: {slotTime}</p>
        </div>
      </div>
      <button className="confirm-button" onClick={handleConfirmAppointment}>Confirm Appointment</button>
    </div>
  );
};

export default ConfirmAppointmentPage;
