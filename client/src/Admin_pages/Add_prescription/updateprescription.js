import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './updateprescription.css'; // Import CSS file for styling

const UpdatePrescriptionPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const location = useLocation();
    const { log } = location.state;
    const [quantity, setQuantity] = useState(1); 

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/medicines');
            setMedicines(response.data);
            setFilteredMedicines(response.data); // Set filtered medicines initially
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = medicines.filter(medicine =>
            medicine.Med_name.toLowerCase().includes(term)
        );
        setFilteredMedicines(filtered);
    };

    const handleAddToPrescription = async (medicine, quantity) => {
        try {
            const response = await axios.post('http://localhost:3001/api/addToPrescription', {
                medicineId: medicine.Medicine_id,
                quantity: quantity,
                log: log
            });
            console.log(response.data); // Log response from backend
            setQuantity(1); // Reset quantity to 1 after adding the medicine
            alert('Medicine added to prescription');
        } catch (error) {
            console.error('Error adding medicine to prescription:', error);
        }
    };

    return (
        <div className="update-prescription-container">
            <h2>Update Prescription</h2>
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for medicine..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="medicine-list">
                {filteredMedicines.map((medicine) => (
                    <div key={medicine.Medicine_id} className="medicine-card">
                        <div className="medicine-info">
                            <h3>{medicine.Med_name}</h3>
                            <p>Description: {medicine.Med_Description}</p>
                            <p>Unit Price: {medicine.Unit_price}</p>
                        </div>
                        <div className="medicine-actions">
                            <div className="quantity">
                                <label htmlFor={`qty_${medicine.Medicine_id}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`qty_${medicine.Medicine_id}`}
                                    min={1}
                                    defaultValue={1}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </div>
                            <button className="add-to-prescription" onClick={() => handleAddToPrescription(medicine, parseInt(document.getElementById(`qty_${medicine.Medicine_id}`).value))}>
                                Add to Prescription
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdatePrescriptionPage;
