import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ViewPrescription.css';

const ViewPrescription = () => {
  const [medicines, setMedicines] = useState([]);
  const location = useLocation();
  const logId = location.state.logId;

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/view_prescription/${logId}`);
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching prescription:', error);
      }
    };

    fetchPrescription();
  }, [logId]);

  const handleOrderNow = () => {
    // Implement your logic for handling the order action here
    console.log('Order Now clicked');
  };

  return (
    <div>
      <h1>Prescription</h1>
      <div className="prescription-container">
        {medicines.map((medicine, index) => (
          <div className="prescription-card" key={index}>
            <div className="prescription-card-info">
              <p className="prescription-item-name">{medicine.Med_name}</p>
              <p className="prescription-item-description">{medicine.Med_Description}</p>
              <p className="prescription-item-unit-price">Unit Price: ${medicine.Unit_price}</p>
            </div>
            <button className="order-now-button" onClick={handleOrderNow}>Order Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPrescription;
