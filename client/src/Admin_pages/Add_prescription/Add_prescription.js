import React, { useState, useEffect } from 'react';
import axios from 'axios';
 // Import CSS file for styling
import {useNavigate} from 'react-router-dom';

const ManageDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
const navigate=useNavigate();

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

  

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = doctors.filter((doctor) =>
      doctor.doc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const fetchslots=(doctor)=>{
    navigate('/chooselog',{state:{doctor:doctor}});
 }

  return (
    <div className="managedoctors-container">
      
      <h2>Select doctor whose patient's prescription is to be updated</h2>
      <div className='managedoctors-a'>
      <input
        type="text"
        placeholder="Search by doctor name"
        value={searchTerm}
        onChange={handleSearch}
        className="managedoctors-search"
      />
       
      </div>
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
            <div className='managedoctorsbutton'>
            <button className='managedoctors-remove' onClick={()=>fetchslots(doctor)}>Choose slot</button>

            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDoctorsPage;
