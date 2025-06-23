import IsDarkMode from "../../utility/DarkDay";
import { useSelector } from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'
import calender from '../../Images/calendar.png'
import medicalrecord from '../../Images/medicalrecord.png'
import prescription from '../../Images/prescription.png'
import visit_room from '../../Images/visit_room.png'
import { useGetDifferentUrlQueryQuery } from '../../services/userAuthApi'
import { getToken,removeToken } from '../../services/LocalStorage'
import Loader from '../Loader';
import { useEffect,useState } from "react";
import CryptoJS from "crypto-js";
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 px-3 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {
                            [
                                {src:calender,alt:"appointment",title:'Appointment Book',href:'/appointment'},
                                {src:medicalrecord,alt:"medicalrecord",title:'MedicalRecord',href:'/medicalrecord'},
                                {src:prescription,alt:"prescription",title:'Prescription',href:'/prescription'},
                                {src:visit_room,alt:"room",title:'Room',href:'/room'},
                               
                            ].map(({src, alt, title,href}, key) => (
                                <Link key={key} to={href} className={` rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition duration-300 ${isDark ? 'bg-gray-800  hover:shadow-gray-600 text-[#e3e3ec]' : 'bg-[#e3e3ec] text-black hover:shadow-[#a7a5a5]'}`}>
                                    <img src={src} alt={alt} className={`mb-4 h-40 w-40   ${isDark?'invert-75':''}`}/>
                                    <h2 className="text-lg font-semibold ">{title}</h2>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div >



        </>
    )
}

export default Home