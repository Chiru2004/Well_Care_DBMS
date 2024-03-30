import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import './buy.css';

function CartBuyPage() {
  const location = useLocation();
  const [paymentError, setPaymentError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const totalAmount = location.state.totalAmount;
  const patientId = location.state.patientId;
  const cartItems = location.state.cartItems;

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/patient/${patientId}`);
        setAddress(response.data.Address);
        setPhoneNumber(response.data.PHONENUMBER);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setIsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);
const handleSubmitPayment = async () => {
  try {
    // Fetch the last order ID from the table
    const lastOrderResponse = await axios.get("http://localhost:3001/api/orders/lastOrderId");
    const lastOrderId = lastOrderResponse.data.lastOrderId;
    
    // Increment the last order ID to generate the new order ID
    const newOrderId = lastOrderId+1;

    // Array to store promises for updating stock quantity
    const updateStockPromises = [];

    // Check stock availability for each item
    for (const item of cartItems) {
      const medicineResponse = await axios.get(`http://localhost:3001/api/medicine/${item.Medicine_id}`);
      const currentStockQuantity = medicineResponse.data.Stock_Quant;

      if (currentStockQuantity < item.Med_quant) {
        throw new Error(`Insufficient stock for item ${item.Medicine_id}`);
      }
    }

    // Post each item to order-items endpoint and gather the responses
    const orderResponses = await Promise.all(cartItems.map(async (item) => {
      const itemData = {
        orderId: newOrderId,
        medicineId: item.Medicine_id,
        quantity: item.Med_quant,
        totalPrice: item.Total_price
      };
      return axios.post("http://localhost:3001/api/order-items", itemData);
    }));

    // Prepare data for the new order
    const orderData = {
      orderId: newOrderId,
      patientId: patientId,
      orderDate: new Date().toISOString().slice(0, 10),
      totalAmount: totalAmount,
      address: address
    };

    // Post the new order
    const orderResponse = await axios.post("http://localhost:3001/api/orders", orderData);

    // Set the order details state
    setOrderDetails(orderResponse.data);

    // Delete each item from the cart and update stock quantity
    await Promise.all(cartItems.map(async (item) => {
      // Delete from cart
      

      // Fetch current stock quantity
      const currentMedicineResponse = await axios.get(`http://localhost:3001/api/medicine/${item.Medicine_id}`);
      const currentStockQuantity = currentMedicineResponse.data.Stock_Quant;
      console.log(currentStockQuantity);
      // Calculate new stock quantity
      const updatedStockQuantity = currentStockQuantity - item.Med_quant;
console.log(updatedStockQuantity);
      // Update stock quantity
      const updateStockPromise = axios.put(`http://localhost:3001/api/update/${item.Medicine_id}/${updatedStockQuantity}`);
      updateStockPromises.push(updateStockPromise);

      await axios.delete(`http://localhost:3001/api/cart/order/${patientId}/${item.Medicine_id}`);
    }));

    // Wait for all stock quantity updates to complete
    await Promise.all(updateStockPromises);

  } catch (error) {
    console.error("Error placing order:", error);
    setPaymentError(error.message);
  }
};

  
  
  return (
    <div className="buy-page-container">
      <h2>Cart / Buy Page</h2>
      <div className="buy-page-content">
        <p className="info">Total Amount: {isLoading ? 'Loading...' : `$${totalAmount}`}</p>
        <p className="info">Address: {isLoading ? 'Loading...' : address}</p>
        <p className="info">Phone Number: {isLoading ? 'Loading...' : phoneNumber}</p>

        <h3>Cart Items</h3>
        <ul className="cart-items-list">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <li className="cart-item" key={index}>
                Medicine ID: {item.Medicine_id}, Quantity: {item.Med_quant}, Total: ${item.Total_price}
              </li>
            ))
          ) : (
            <p>No items in cart</p>
          )}
        </ul>

        <button className="proceed-btn" onClick={handleSubmitPayment}>Place Order</button>
        {paymentError && <p className="error-msg">Error: {paymentError}</p>}
        
        {orderDetails && (
          <div className="order-detail">
            <h3>Order Details</h3>
      
          
            <p>Patient ID: {orderDetails.patientId}</p>
            <p>Order Date: {orderDetails.orderDate}</p>
            <p>Order Status: {orderDetails.orderStatus}</p>
            <p>Total Amount: ${orderDetails.amount}</p>
            <p>Delivery Address: {orderDetails.deliveryAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartBuyPage;
