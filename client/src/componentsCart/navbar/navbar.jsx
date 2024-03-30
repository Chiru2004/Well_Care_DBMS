import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="navbar">
      <div className="navcontainer">
        <h1 className='logo'>Pharmacy</h1>  
        <div className="navitems">
         
          
          {/* Use navigate function to navigate to cart/order */}
          <left><button className="navButton" onClick={() => navigate("/cart/order")}> Go to Cart</button></left>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
