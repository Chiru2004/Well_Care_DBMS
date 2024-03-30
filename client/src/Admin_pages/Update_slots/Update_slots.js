import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Update_slots.css'; // Import CSS file for styling

const AddSlotForm = () => {

  const location=useLocation();
  const {doctor}=location.state;
  const [error, setError] = useState('');
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  const [formData, setFormData] = useState({
    doctorId: doctor.doc_id,
    slotDate: '',
    slotTime: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/addslot', formData);
      alert('Slot added successfully');
      setFormData({
        doctorId: doctor.doc_id,
        slotDate: '',
        slotTime: ''
        
      });
    } catch (error) {
      console.error('Error adding slot:', error);
      setError('Error adding slot. Please try again.');
    }
  };

  return (
    <div className="slots-addition-container">
      <div className="slots-addition-button ">
      <div className="slots-addition-heading">
      <h1>Add Slot</h1>
      <h4>Doctor_id : {doctor.doc_id}</h4>
      </div>
      </div>
      <div className="slots-addition-input">
       <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="slotDate">Date : </label>
          <input type="date" id="slotDate" name="slotDate" value={formData.slotDate} onChange={handleChange} min={currentDate}/>
        </div>
        <div className="form-group">
          <label htmlFor="slotTime">Time : </label>
          <input type="time" id="slotTime" name="slotTime" value={formData.slotTime} onChange={handleChange} />
        </div>
        <button className="slots-addition-add-button" type="submit">Add Slot</button>
      </form>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddSlotForm;

