import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
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

  // Redirect to login page if user is not logged in
  if (!user) {
    return (
      <div>
    
    <button onClick={()=>navigate("/")}>Login to continue</button>
    </div>);// or any loading indicator you prefer
  }

  return (
    <div className="landing-page">
          <div className="user_home_left-side">
          </div>
          <div className="right-side">
          <h1>WELL CARE!</h1>
          <nav>
        <ul>
        <center>
        <button className="cbutton" onClick={handlebookAppointments}>Book an Appointments</button>
        <button className="cbutton" onClick={handleViewAppointments}>View Upcoming Appointments</button>
        <button className="cbutton" onClick={handleViewHistory}>View Medical History</button>
        <button className="cbutton" onClick={()=>navigate('/cart')}>Order Products</button>
        <button className="cbutton" onClick={handleLogout}>Logout</button>


        </center>
        </ul>
          </nav>
          </div>
        </div>
  );
};

export default Home;
