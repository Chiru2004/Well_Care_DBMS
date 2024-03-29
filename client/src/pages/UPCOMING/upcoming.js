import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import './UpcomingAppointments.css'; // Import CSS for styling

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();
  const user = location.state.user;

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/uappointments/${user.patient_id}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
      }
    };

    fetchUpcomingAppointments();
  }, [user]);

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD'); // Adjust format as needed
  };

  return (
    <div className="upcoming-appointments-container">
      <h1>Upcoming Appointments</h1>
      <div className="appointment-cards-container">
        {appointments.map(appointment => (
          <div key={appointment.appointment_id} className="appointment-card">
            <p><b>Date: {formatDate(appointment.appointment_date)}</b></p>
            <p><b>Time: {appointment.appointment_time}</b></p>
            <p>Status: {appointment.appointment_status}</p>
            <p>Doctor Name: {appointment.doc_name}</p>
            <p>Doctor Qualification: {appointment.doc_qualification}</p>
            <p>Doctor Dept: {appointment.doc_dept}</p>
            <p>Doctor Specification: {appointment.doc_specification}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
