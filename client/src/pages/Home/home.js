import React, { useState, useEffect } from 'react';
import axios from 'axios';
import{useNavigate,Link} from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate=useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is logged in
        const response = await axios.get('http://localhost:3001/api/home', { withCredentials: true });

        if (response.data.user) {
          setUser(response.data.user);
        } else {
          // Redirect to login page if user is not logged in

             navigate('/login')  ;
      }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await axios.get('http://localhost:3001/api/logout', { withCredentials: true });
      // Redirect to login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const login=async ()=>{
    navigate('/login');
  }

  const register=async()=>{
    navigate ('/register');
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}</h1>
          {/* Add your home page content here */}
          <button onClick={handleLogout}>Logout</button>
          <Link to="/book_appointment">
            <button>Book an Appointment</button>
          </Link>
        </div>
      ) : (
        <div>
            <button onClick={register} >
                register
            </button>

            <button onClick={login} >
                login
            </button>
            

        </div>
      )}
    </div>
  );
};

export default Home;
