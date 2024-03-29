import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import './LogsPage.css'; // Import CSS file for styling

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/mhistory/${user.patient_id}`);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, [user]);

  const handleViewPrescription = (logId) => {
    navigate('/view_prescription', { state: { logId } });
  };

  return (
    <div className="medical-history-container">
      <h1>MEDICAL HISTORY</h1>
      {logs.map(log => (
        <div key={log.log_id} className="medical-history-entry">
          <p className="log-date">Date: {moment(log.log_date).format('YYYY-MM-DD')}</p>
          <p className="log-time">Time: {log.log_time}</p>
          {log.d_id && (
            <div>
              <p className="doctor-name">Doctor Name: {log.doc_name}</p>
              <p className="doctor-department">Doctor Department: {log.doc_dept}</p>
            </div>
          )}
          <button className="view-prescription-button" onClick={() => handleViewPrescription(log.log_id)}>View Prescription</button>
        </div>
      ))}
    </div>
  );
};

export default LogsPage;
