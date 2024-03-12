import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'; // Import useHistory hook

import './apointment.css'; // Import custom styles

const BookAppointmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const navigate = useNavigate(); // Get the history object from React Router

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDoctors = async (department) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/doctors/${department}`);
      setDoctors(response.data);
    } catch (error) {
      console.error(`Error fetching doctors for department ${department}:`, error);
    }
  };

  const handleSelectDept = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    fetchDoctors(selectedDept);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);


 
  const handleBookNow = (doctor) => {
    navigate('/slots_display', { state: { doctor: doctor } });
  };



  return (
    <div className=" appointcontainer">
      <div className="dropdown-container">
        <h2>Select Department</h2>
        <select className="dropdown" value={selectedDepartment} onChange={handleSelectDept}>
          <option value="">Select a Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>{department}</option>
          ))}
        </select>
      </div>

      <div className="doctors-container">
        <h2>Doctors</h2>
        <div className="doctors-grid">
          {doctors.length > 0 ? 
            doctors.map((doctor, index) => (
              <div key={index} className="doctor-card">
                <img src="https://imgs.search.brave.com/VH43WJzG0SSdiLhM3SuFprQTC9zgr5BmMXwdMr0Jn0w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by93/b21hbi13b3JraW5n/LWFzLWRvY3Rvcl8y/My0yMTQ4ODI3ODE5/LmpwZz9zaXplPTYy/NiZleHQ9anBn" alt="Doctor" className="doctor-image" />
                <div className="doctor-details">
                  <h3 className="doctor-name">{doctor.doc_name}</h3>
                  <p className="doctor-info">{doctor.doc_qualification}</p>
                  <p className="doctor-info">{doctor.doc_specification}</p>
                  <button onClick={() => handleBookNow(doctor)}>Book Now</button>

                </div>
              </div>
            )) :
            <p>No doctors found</p>
          }
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
