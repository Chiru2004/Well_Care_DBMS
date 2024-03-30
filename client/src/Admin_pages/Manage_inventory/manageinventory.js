import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageinventory.css';
import { Link } from 'react-router-dom'; // Import Link

const ManageInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [stock, setStock] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const filtered = medicines.filter((medicine) =>
      medicine.Med_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/fetchmedicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const handleDelete = async (medicineId) => {
    try {
      await axios.delete(`http://localhost:3001/api/deletemedicines/${medicineId}`);
      setMedicines(medicines.filter((medicine) => medicine.Medicine_id !== medicineId));
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleUpdateStock = async (medicineId, newStockQuantity) => {
    try {
      await axios.put(`http://localhost:3001/api/updatemedicines/${medicineId}`, { Stock_Quant: newStockQuantity });
      setMedicines(
        medicines.map((medicine) =>
          medicine.Medicine_id === medicineId ? { ...medicine, Stock_Quant: newStockQuantity } : medicine
        )
      );
      alert('stock updated');
      setStock('');
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="manage-medicine-inventory-container">
      <h2>Manage Inventory</h2>
      <input
        type="text"
        placeholder="Search Medicine..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="manage-medicine-search-input"
      />
      <Link to="/addmedicine" className="manage-medicine-add-button">Add New Medicine</Link>
      <div className="manage-medicine-cards-container">
        {filteredMedicines.map((medicine) => (
          <div key={medicine.Medicine_id} className="manage-medicine-card">
            <h3>{medicine.Med_name}</h3>
            <p>Description: {medicine.Med_Description}</p>
            <p>Unit Price: {medicine.Unit_price}</p>
            <p>Stock Quantity: {medicine.Stock_Quant}</p>
            <div>
              <input
                type="number"
                placeholder="Enter new stock quantity"
                onChange={(e) => setStock(parseInt(e.target.value))}
                className="manage-medicine-stock-input"
              />
              
              <button onClick={() => handleUpdateStock(medicine.Medicine_id, stock)} className="manage-medicine-update-stock-button">Update Stock</button>
              <button onClick={() => handleDelete(medicine.Medicine_id)} className="manage-medicine-remove-button">Remove</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageInventory;
