import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
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

  // Redirect to login page if user is not logged in
  if (!user) {
    return (
      <div>
    
    <button onClick={()=>navigate("/")}>Login to continue</button>
    </div>);// or any loading indicator you prefer
  }

  return (
    <div className="home-container">
      <Navbar />
      <h1 className="website-name">Well Care!</h1>
      <p className="tagline">We got you covered!</p>
    </div>
  );
};

export default Home;
