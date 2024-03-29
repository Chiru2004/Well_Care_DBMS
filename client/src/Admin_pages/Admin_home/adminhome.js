import React  from "react";
import './adminhome.css';
import { useNavigate } from "react-router-dom";


function Landing(){
const navigate=useNavigate();
    const Managedoctors = () => {
        navigate('/managedoctors');
      };
    
      const Manageslots = () => {
        navigate('/managedoctors');
      };

      const Addprescription=()=>{
        navigate('/addprescription');

      }

      const Adddoctors=()=>{
        navigate('/addadoctor');

      }

      const Manageinventory=()=>{
        navigate('/');

      }


    
    return (
        <div className="landing-page">
          <div className="adminhome_left-side">
              
          </div>
          <div className="right-side">
            <h1>WELL CARE!</h1>
            <button className="button" onClick={Managedoctors}>Manage Doctors</button>
            <button className="button" onClick={Manageslots}>Manage Slots</button>
            <button className="button" onClick={Addprescription}>Add Prescription</button>
            <button className="button" onClick={Adddoctors}>Add Doctors</button>
            <button className="button" onClick={Manageinventory}>Manage Inventory</button>
          </div>
        </div>
      );

};

export default Landing;
