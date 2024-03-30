import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./searchResults.css"; // Import CSS file for styling

function SearchResultsPage() {
  const location = useLocation();
  const { searchData } = location.state;
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    if (searchData) {
      setFilterData(searchData.map(item => ({ ...item, quantity: item.Med_quant || 0 })));
    }
  }, [searchData]);

  const [user,setUser]=useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/home', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const addToCart = (item) => {
    const quantity = item.quantity;
    if (quantity <= 0) {
      window.alert("Invalid quantity. Quantity must be greater than 0.");
      return;
    }

    
  
    // Generate timestamp for added time
    const added_time = new Date().toISOString();
    

    // Make a POST request to send data to backend
    axios.post("http://localhost:3001/api/add-to-cart", { 
      Patient_id:user.patient_id,
      Medicine_id: item.Medicine_id,
      Unit_price:item.Unit_price,
      Total_price: quantity * item.Unit_price,
      Med_quant: quantity,
      Added_time: added_time,
      Updated_time: added_time
    })
      .then(response => {
        window.alert(`${quantity} ${item.Med_name}(s) added to cart successfully.`);
        console.log("Item added to cart:", response.data);
      })
      .catch(error => {
        window.alert(`Error adding ${item.Med_name}(s) to cart. Please try again later.`);
        console.error("Error adding item to cart:", error);
      });
  };

  const handleQuantityChange = (index, event) => {
    const { value } = event.target;
    // Parse the input value to ensure it's a valid number
    const parsedValue = parseInt(value);

    // Check if the parsed value is NaN or less than 0
    if (isNaN(parsedValue) || parsedValue < 0) {
      // If it's NaN or negative, set the quantity to 0
      setFilterData(prevState => {
        const updatedFilterData = [...prevState];
        updatedFilterData[index].quantity = 0;
        return updatedFilterData;
      });
    } else {
      // If it's a valid number, update the quantity state
      setFilterData(prevState => {
        const updatedFilterData = [...prevState];
        updatedFilterData[index].quantity = parsedValue;
        return updatedFilterData;
      });
    }
  };

  return (
    <div>
      <h2>Search Results</h2>
      {filterData && filterData.length > 0 ? (
        <ul>
          {filterData.map((item, index) => (
            <li key={item.id}>
              <div className="medicine-box">
                <div className="medicine-details">
                  <div>{item.Medicine_id}</div>
                  <div>{item.Med_name}</div>
                  <div>Medical description: {item.Med_Description}</div>
                  <div>Unit price: ${item.Unit_price}</div>
                  <div>{item.Stock_Quant}</div>
                </div>
                <div className="button-container">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(index, event)}
                    className="input-field"
                  />
                  <button className="add-to-cart-button" onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
      <button className="proceed-to-order-button" onClick={() => navigate("/cart/order")}>Proceed to Order</button>
    </div>
  );
}

export default SearchResultsPage;
