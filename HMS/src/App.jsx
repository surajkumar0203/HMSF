import Headers from './Components/Headers'
import { Route, Routes } from "react-router-dom";
import Home from './Components/Pages/Home';
import Appoinment from './Components/Pages/Appoinment';
import ContactUs from './Components/Pages/ContactUs';
import AboutUS from './Components/Pages/AboutUS';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ChangePassword from './Components/Pages/ChangePassword';

function App() {
  

  return (
    <>
       <Headers/>
     
       <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/appoinment" element={<Appoinment/>}></Route>
          <Route path="/contactus" element={<ContactUs/>}></Route>
          <Route path="/aboutus" element={<AboutUS/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
          <Route path="/account/resetpassword/:uid/:token" element={<ChangePassword/>}></Route>
       </Routes>
   
    </>
  )
}

export default App
