// Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/home', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3001/api/logout', { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewAppointments = () => {
    navigate('/upcoming_appointments', { state: { user } });
  };

  const handleViewHistory = () => {
    navigate('/medical_history', { state: { user } });
  };
  const handlebookAppointments=()=>{
          
          navigate('/book_appointment');
  }

  return (
    <nav>
      <ul>
        <li><span onClick={handlebookAppointments}>Book an Appointments</span></li>
        <li><span onClick={handleViewAppointments}>View Upcoming Appointments</span></li>
        <li><span onClick={handleViewHistory}>View Medical History</span></li>
        <li><span onClick={handleLogout}>Logout</span></li>
      </ul>
    </nav>
  );
}

export default Navbar;
