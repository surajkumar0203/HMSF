import Headers from './Components/Headers'
import { Route, Routes } from "react-router-dom";
import Home from './Components/Pages/Home';
import Appoinment from './Components/Pages/Patient/Appoinment';
import ContactUs from './Components/Pages/ContactUs';
import AboutUS from './Components/Pages/AboutUS';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ChangePassword from './Components/Pages/ChangePassword';
import ActivateAccount from './Components/Pages/ActivateAccount'
import MedicalRecord from './Components/Pages/Patient/MedicalRecord';
import Index from './Components/Pages/Index';
import PaymentSuccess from './Components/Pages/PaymentSuccess';
import Prescription from './Components/Pages/Patient/Prescription';
import DoctorPatientList from './Components/Pages/Doctor/DoctorPatientList';
import PatientDetails from './Components/Pages/Doctor/PatientDetails';
import Profile from './Components/Pages/Profile';
import LeaveApply from './Components/Pages/LeaveApply';

function App() {
  
  return (
    <>
       <Headers/>
     
       <Routes>
          <Route path="/" element={<Index/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/appointment" element={<Appoinment/>}></Route>
          <Route path="/appointment/paymentconformation" element={<PaymentSuccess/>}></Route>
          <Route path="/contactus" element={<ContactUs/>}></Route>
          <Route path="/aboutus" element={<AboutUS/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
          <Route path="/account/resetpassword/:uid/:token" element={<ChangePassword/>}></Route>
          <Route path="/account/activate/:uid/:token" element={<ActivateAccount/>}></Route>
          <Route path="/medicalrecord" element={<MedicalRecord/>}></Route>
          <Route path="/prescription" element={<Prescription/>}></Route>
          <Route path="/doctorpatientlist" element={<DoctorPatientList/>}></Route>
          <Route path="/patientdetails/:amtID" element={<PatientDetails/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/leave" element={<LeaveApply/>}></Route>

       </Routes>
   
    </>
  )
}

export default App
