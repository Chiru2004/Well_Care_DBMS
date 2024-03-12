import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './slot_display.css'; // Import CSS file

const SlotsDisplayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // State to store user data

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Function to fetch user data from the backend
  

  // Function to fetch slots data from the backend
  const fetchSlots = async () => {
    if (!selectedDate || !doctor) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/slots?date=${selectedDate}&doctorId=${doctor.doc_id}`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Error fetching slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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

  const handleBookNowClick =  (slot) => {
    // Fetch user data before navigating to the confirmation page
    // Navigate to the confirmation page with necessary data
    
  
    navigate('/confirmappointment', {
      state: {
        doctor,
        user,
        slotDate: selectedDate,
        slotTime:slot.slot_time,
      },
    });
  };

  useEffect(() => {
    fetchSlots(); 
    // Fetch slots data when selectedDate or doctor changes
  }, [selectedDate, doctor]);

  return (
    <div className="slotcontainer">
      <div className="sdoctor-details">
        <h2>Doctor Details</h2>
        
        {doctor ? (
          <>
            <p>Doctor_Name: {doctor.doc_name}</p>
            <p>Qualification: {doctor.doc_qualification}</p>
            <p>Specialization: {doctor.doc_specification}</p>
          </>
        ) : (
          <p>No doctor selected</p>
        )}
      </div>

      <div className="date-selection">
        <label>Select Date:</label>
        <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={handleDateChange} />
      </div>

      {loading ? (
        <p className="loading">Loading slots...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : slots.length === 0 ? (
        <p className="error">No slots available for the selected date and doctor</p>
      ) : (
        <div className="slot-container">
          <h2>Available Slots</h2>
          <div className="slot-list">
            {slots.map((slot, index) => (
              <div className="slot" key={index}>
                <p>{selectedDate}</p>
                <p>{slot.slot_time}</p>
                <button className="book-now-button" onClick={() => handleBookNowClick(slot)}>Book Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsDisplayPage;
