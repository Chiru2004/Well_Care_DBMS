import React  from "react";
import './landing.css';
import { useNavigate } from "react-router-dom";


function Landing(){
const navigate=useNavigate();
    const login = () => {
        navigate('/login');
      };
    
      const register = () => {
        navigate('/register');
      };

      const adminlogin=()=>{
        navigate('/adminlogin');

      }
    
    return (
        <div className="landing-page">
          <div className="left-side">
              
          </div>
          <div className="right-side">
            <h1>WELL CARE!</h1>
            <button className="button" onClick={register}>Register User</button>
            <button className="button" onClick={login}>Login User</button>
            <button className="button" onClick={adminlogin}>Login Admin</button>
          </div>
        </div>
      );

};

export default Landing;
