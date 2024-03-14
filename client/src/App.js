import Login from './pages/Login_User/login';
import Register from './pages/Register_User/register_user';
import Landing from './pages/Landing_page/landing';
import BookAppointment from './pages/APPOINTMENT/appointment';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import SlotsDisplayPage from './pages/slot_display/slot_display.js';
import Confirmappointment from './pages/APPOINTMENT/confirmappointment.js';
import AppointmentDetailsPage from './pages/APPOINTMENT/appointment_details.js';
import AddDoctorForm from './Admin_pages/Add_doctor/adddoctor.js';
import './App.css';
import Home from './pages/Home/home';
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

    </Routes>
    </Router>
    </div>
  );
}

export default App;
