import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import './chooselog.css';

const ChooseLogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const { doctor } = location.state;
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    if (doctor) {
      fetchLogs(doctor.doc_id);
    }
  }, [doctor]);

  useEffect(() => {
    filterLogsByDate(selectedDate);
  }, [selectedDate]);

  const fetchLogs = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/fetchlogs/${doctorId}`);
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const filterLogsByDate = (date) => {
    const filtered = logs.filter((log) => moment(log.log_date).isSame(date, 'day'));
    setFilteredLogs(filtered);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const handleUpdatePrescription = (log) => {
    navigate('/updateprescription', { state: { log } });
  };

  return (
    <div className="chooselog-container">
      <h2>Logs for Doctor: {doctor && doctor.doc_name}</h2>
      <div className="chooselog-date">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="chooselog-grid">
        {filteredLogs.map((log) => (
          <div key={log.log_id} className="chooselog-row">
            <div className="chooselog-details">
              <p>Date: {moment(log.log_date).format('YYYY-MM-DD')}</p>
              <p>Time: {log.log_time}</p>
            </div>
            <div className="chooselog-button">
              <button onClick={() => handleUpdatePrescription(log)}>Update Prescription</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseLogPage;
