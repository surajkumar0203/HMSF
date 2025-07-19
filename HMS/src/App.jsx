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
import PageNotFound from './Components/PageNotFound';
import { getToken } from './services/LocalStorage';
import { useSelector } from 'react-redux';
import { useEffect,useState } from 'react';
const secretKey = import.meta.env.VITE_ID_SECRET;
import CryptoJS from "crypto-js";


function App() {
  const accessToken = getToken().access
  const userID = useSelector(state=>state.storeid.id)
 
  const [currentRole,setCurrentRole] = useState(null)
  
  useEffect(()=>{
    if(userID){
      const bytes = CryptoJS.AES.decrypt(userID, secretKey);
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      setCurrentRole(decryptedId.split("-")[0])
    }
  },[userID])

  return (
    <>
       <Headers/>
     
       <Routes>
          <Route path="/" element={<Index/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/appointment" element={accessToken?<Appoinment/>:<Index/>}></Route>
          <Route path="/appointment/paymentconformation" element={accessToken?<PaymentSuccess/>:<Index/>}></Route>
          <Route path="/contactus" element={<ContactUs/>}></Route>
          <Route path="/aboutus" element={<AboutUS/>}></Route>
          <Route path="/login" element={!accessToken?<Login/>:<Home/>}></Route>
          <Route path="/register" element={!accessToken?<Register/>:<Index/>}></Route>
          <Route path="/forgotpassword" element={!accessToken?<ForgotPassword/>:<Index/>}></Route>
          <Route path="/account/resetpassword/:uid/:token" element={!accessToken?<ChangePassword/>:<Index/>}></Route>
          <Route path="/account/activate/:uid/:token" element={!accessToken?<ActivateAccount/>:<Index/>}></Route>
          <Route path="/medicalrecord" element={accessToken && currentRole==='PT'? <MedicalRecord/>:<PageNotFound/>}></Route>
          <Route path="/prescription" element={accessToken && currentRole==='PT'?<Prescription/>:<PageNotFound/>}></Route>
          <Route path="/doctorpatientlist" element={accessToken && currentRole==='DR'?<DoctorPatientList/>:<PageNotFound/>}></Route>
          <Route path="/patientdetails/:amtID" element={accessToken && currentRole==='PT'?<PatientDetails/>:<PageNotFound/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/leave" element={accessToken && currentRole==='DR'?<LeaveApply/>:<PageNotFound/>}></Route>
          <Route path='/*' element={<PageNotFound/>}></Route>
       </Routes>
   
    </>
  )
}

export default App
