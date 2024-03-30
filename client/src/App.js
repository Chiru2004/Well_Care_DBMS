import Login from './pages/Login_User/login';
import Register from './pages/Register_User/register_user';
import Landing from './pages/Landing_page/landing';
import BookAppointment from './pages/APPOINTMENT/appointment';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import SlotsDisplayPage from './pages/slot_display/slot_display.js';
import Confirmappointment from './pages/APPOINTMENT/confirmappointment.js';
import AppointmentDetailsPage from './pages/APPOINTMENT/appointment_details.js';
import AddDoctorForm from './Admin_pages/Add_doctor/adddoctor.js';
import ManageDoctorsPage from './Admin_pages/Manage_doctors/managedoctors.js';
import AddSlotForm from './Admin_pages/Update_slots/Update_slots.js';
import DeleteSlotForm from './Admin_pages/Delete_slots/Delete_slots.js';
import ChooseLog from './Admin_pages/Add_prescription/chooselog.js';
import AddPrescription from './Admin_pages/Add_prescription/Add_prescription.js';
import UpdatePrescription from './Admin_pages/Add_prescription/updateprescription.js';
import Upcoming from './pages/UPCOMING/upcoming.js';
import Medical_history from'./pages/MEDICALHISTORY/history.js';
import './App.css';
import Home from './pages/Home/home';
import Vp from './pages/Viewprescription/viewprescription.js';
import Admin_login from './Admin_pages/Admin_login/Admin_login.js';
import Admin_home from './Admin_pages/Admin_home/adminhome.js';
import AddMedicine from './Admin_pages/Manage_inventory/addmedicine.js';
import Manageinventory from './Admin_pages/Manage_inventory/manageinventory.js';

//
import ViewCart from "../src/Ecommerce/viewCart/viewCart"
import Cart from "../src/Ecommerce/cart/cart";
import Search from "../src/Ecommerce/search/search"
import Buy from "./Ecommerce/buy/buy";
import ManageInventory from './Admin_pages/Manage_inventory/manageinventory.js';
function App() {
  return (
    <div className="App">
    <Router>
    <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path='/' element={<Landing/>}/>
    <Route path='/book_appointment' element={<BookAppointment/>}/>
    <Route path="/slots_display" element={<SlotsDisplayPage/>} />
    <Route path='/confirmappointment' element ={<Confirmappointment/>}/>
    <Route path='/appointmentdetails' element={<AppointmentDetailsPage/>}/>
    <Route path='/addadoctor' element={<AddDoctorForm/>}/>
    <Route path='/managedoctors' element={<ManageDoctorsPage/>}/>
    <Route path='/addslots' element={<AddSlotForm/>}></Route>
    <Route path='/deleteslots' element={<DeleteSlotForm/>}></Route>
    <Route path='/addprescription' element={<AddPrescription/>}/>
    <Route path='/chooselog' element ={<ChooseLog/>}/>
    <Route path='/updateprescription' element ={<UpdatePrescription/>}/>
    <Route path ='/upcoming_appointments' element={<Upcoming/>}/>
    <Route path='/medical_history' element={<Medical_history/>}/>
    <Route path='/view_prescription' element={<Vp/>}/>
    <Route path='/adminlogin' element ={<Admin_login/>}/>
    <Route path='/adminhome' element  ={<Admin_home/>}/>
    <Route path='/addmedicine' element  ={<AddMedicine/>}/>
    
    <Route path='/manageinventory' element  ={<ManageInventory/>}/>

     
    
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/cart/buy" element={<ViewCart/>}/>
    
    <Route path="/cart/order" element={<ViewCart/>}/>
    <Route path="cart/search" element={<Search/>}/>
    <Route path="/buy" element={<Buy/>}/>


    </Routes>
    </Router>
    </div>
  );
}

export default App;
