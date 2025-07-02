import IsDarkMode from "../../utility/DarkDay";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGetDifferentUrlQueryQuery } from '../../services/userAuthApi'
import { getToken,removeToken } from '../../services/LocalStorage'
import Loader from '../Loader';
import { useEffect,useState } from "react";
import CryptoJS from "crypto-js";
import PatientDashboard from "./Patient/PatientDashboard";
import DoctorDashboard from "./Doctor/DoctorDashboard";
const secretKey = import.meta.env.VITE_ID_SECRET;



const Home = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const user_id=useSelector(state=>state.storeid.id)
    const navigate=useNavigate()
    const accessToken=getToken().access;
    const [role,setRole]=useState('')
    
    useEffect(()=>{
        if(user_id){
            const bytes = CryptoJS.AES.decrypt(user_id, secretKey);
            const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
            const id =  decryptedId?.split("-")[0]
            setRole(id)
        }else{
            removeToken()
            navigate('/login');
        }
 
    },[user_id])

    // ye RTK Query (Redux Toolkit Query) ka option object hai jo API call ko condition-based skip karta hai.
        // skip: !role || !accessToken

    const { data: user, isLoading } = useGetDifferentUrlQueryQuery({role,token:accessToken},{ skip: !role || !accessToken})

   
        if (isLoading) {
            return (
                <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                    <div className='h-[94vh] flex flex-row items-center justify-center'>
                        <Loader />
                    </div>
                </div>
            )
        }
    return (
        <>
            <div className={`min-h-screen w-full  overflow-hidden ${IsDarkMode(isDark)} `}>

                <h1 className={`text-3xl mt-24 px-10 font-bold mb-6`}>
                    Welcome <span className="text-[#1db91d]">{user?.name}</span>
                </h1>
                <div className="max-w-6xl mx-auto">
                    {
                        role==='PT'?
                            <PatientDashboard isDark={isDark}/>
                        :
                            <DoctorDashboard isDark={isDark}/>
                    }
                </div>
                
            </div >
        </>
    )
}

export default Home