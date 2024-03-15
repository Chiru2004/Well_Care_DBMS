import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './managedoctors.css'; // Import CSS file for styling

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/fetchdoctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://localhost:3001/api/deletedoctors/${doctorId}`);
      setDoctors(doctors.filter((doctor) => doctor.doc_id !== doctorId));
      setFilteredDoctors(filteredDoctors.filter((doctor) => doctor.doc_id !== doctorId));
    } catch (error) {
      console.error('Error removing doctor:', error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = doctors.filter((doctor) =>
      doctor.doc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="managedoctors-container">
      <h2>Manage Doctors</h2>
      <input
        type="text"
        placeholder="Search by doctor name"
        value={searchTerm}
        onChange={handleSearch}
        className="managedoctors-search"
      />
      <div className="managedoctors-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.doc_id} className="managedoctors-row">
            <div className="managedoctors-details">
              <h3>{doctor.doc_name}</h3>
              <p>Age: {doctor.doc_age}</p>
              <p>Qualification: {doctor.doc_qualification}</p>
              <p>Department: {doctor.doc_dept}</p>
              <p>Experience: {doctor.doc_experience}</p>
              <p>Contact: {doctor.doc_contact}</p>
              <p>Specification: {doctor.doc_specification}</p>
            </div>
            <button className="managedoctors-remove" onClick={() => handleRemoveDoctor(doctor.doc_id)}>
              Remove Doctor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDoctorsPage;
