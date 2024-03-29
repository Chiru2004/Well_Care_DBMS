import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import './Delete_slots.css'
const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const location = useLocation();
  const { doctor } = location.state;

  useEffect(() => {
    if (doctor && doctor.doc_id) {
      fetchSlots(doctor.doc_id);
      // Start a background task to periodically delete slots
      const intervalId = setInterval(() => {
        deleteExpiredSlots();
      }, 60000); // Check every minute
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [doctor]);

  const fetchSlots = async (doctorId) => {
    try {
      const currentTimestamp = new Date().toISOString().split('.')[0];
      const response = await axios.get(`http://localhost:3001/api/F_slots/${doctorId}?timestamp=${currentTimestamp}`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:3001/api/d_slots/${slotId}`);
      setSlots(prevSlots => prevSlots.filter(slot => slot.slot_id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  const deleteExpiredSlots = async () => {
    try {
      const currentTimestamp = new Date().toISOString().split('.')[0];
      await axios.delete(`http://localhost:3001/api/delete_expired_slots?timestamp=${currentTimestamp}`);
      // Refetch slots after deleting expired ones
      fetchSlots(doctor.doc_id);
    } catch (error) {
      console.error('Error deleting expired slots:', error);
    }
  };

  return (
    <div className="admindeleteslots_admin_slot_delete_doctor-slots">
      <h2>Doctor Slots</h2>
      <div className="admindeleteslots_admin_slot_delete_slot-list">
        {slots.map(slot => (
          <div className="admindeleteslots_slot" key={slot.slot_id}>
            <p>Date: {moment(slot.slot_date).format('YYYY-MM-DD')}</p>
            <p>Time: {slot.slot_time}</p>
            <button onClick={() => handleDeleteSlot(slot.slot_id)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={deleteExpiredSlots}>Delete Expired Slots</button>

    </div>
  );
};

export default SlotList;
