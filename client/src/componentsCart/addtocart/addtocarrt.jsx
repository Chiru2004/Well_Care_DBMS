import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./addtocart.css"; // Import CSS file for styling

function Addtocart() {
  const location = useLocation();
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // State to store the total amount
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    // Fetch cart/order data from the backend
    axios.get("http://localhost:3001/api/cart/order")
      .then((response) => {
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        // Extract data from the response
        const data = response.data;
        // Update cartData state
        setCartData(data);

        // Calculate total amount
        const total = data.reduce((accumulator, currentItem) => accumulator + currentItem.Total_price, 0);
        setTotalAmount(total);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(
          "There was a problem with the fetch operation. Please try again later."
        );
      });
  }, []);

  const handleRemoveItem = (item) => {
    // Send a delete request to remove the item from the cart
    axios.delete(`http://localhost:3001/api/cart/order/${item.Patient_id}/${item.Medicine_id}`)
      .then((response) => {
        // If deletion is successful, fetch the updated cart data
        if (response.status === 200) {
          // Fetch updated cart/order data
          axios.get("http://localhost:3001/api/cart/order")
            .then((response) => {
              const data = response.data;
              setCartData(data);
  
              // Recalculate total amount
              const total = data.reduce((accumulator, currentItem) => accumulator + currentItem.Total_price, 0);
              setTotalAmount(total);
            })
            .catch((error) => {
              console.error("Error fetching updated cart data:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const handleProceedToBuy = () => {
    // Create an array to hold the selected items
    const selectedItems = cartData.map(item => ({
      Med_name: item.Med_name,
      Medicine_id: item.Medicine_id,
      Med_quant: item.Med_quant,
      Unit_price: item.Unit_price,
      Total_price: item.Total_price
    }));
  
    // Navigate to the "/buy" page with totalAmount, patientId, and selected items in the state object
    navigate("/buy", { state: { totalAmount, patientId: user.patient_id, cartItems: selectedItems  } });
  };

  return (
    <div>
      <h2>Cart / Order</h2>
      {cartData && cartData.length > 0 ? (
        <div>
          {cartData.map((item, index) => (
            <div className="cart-item-container" key={index}>
              <div className="cart-item">
                <div className="cart-item-details">
                  <div>{item.Med_name}</div>
                  <div>Medicine ID: {item.Medicine_id}</div>
                  <div>Quantity: {item.Med_quant}</div>
                  <div>Unit Price: ${item.Unit_price}</div>
                  <div>Total Price: ${item.Total_price}</div>
                </div>
                <button className="cart-item-remove-button" onClick={() => handleRemoveItem(item)}>Remove</button>
              </div>
            </div>
          ))}
          <p>Total Amount: ${totalAmount}</p>
        </div>
      ) : (
        <p>No items in cart/order</p>
      )}
      <button className="proceed" onClick={handleProceedToBuy}>Proceed to Buy</button>
    </div>
  );
}

export default Addtocart;
