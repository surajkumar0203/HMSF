import { useEffect, useState } from 'react';
import IsDarkMode from '../../utility/DarkDay';
import { useSelector } from 'react-redux'
import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_ID_SECRET;
const URL = import.meta.env.VITE_ID_BACKEND_URL
import capitalize from '../../utility/Capitalize';
import {convert24To12hour} from '../../utility/timeFormat'

const Profile = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const User = useSelector(state => state.currentUser.currentUser)

    const [currentUser, setCurrentUser] = useState({})
    useEffect(() => {

        if (User) {
            const bytes = CryptoJS.AES.decrypt(User, secretKey);
            const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
            const jsonParse = JSON.parse(decryptedId)
            setCurrentUser(jsonParse)
        }
    }, [User])
   
    return (
        <div className={`min-h-screen flex  justify-center ${IsDarkMode(isDark)} px-4`}>


            <div className="w-full max-w-2xl overflow-hidden  border  mt-25 mb-4 border-gray-600 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                <div className="flex  flex-col border-b py-2 px-3 items-center md:flex-row gap-6">
                    {/* Profile Image */}
                    <img
                        src={`${URL}${currentUser.profile_image}`}
                        alt={currentUser.profile_image}
                        className="w-24 h-24 rounded-full mb-2 border-4 border-yellow-400 object-cover"
                    />

                    {/* User Info */}
                    <div className="text-center md:text-left ">
                        <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                        <p className="text-lg text-gray-400 ">{currentUser.user_id}</p>
                    </div>
                </div>


                {/* more Details */}
                <div className="grid grid-cols-2 gap-4 mt-3 py-2 px-3  ">
                    {
                        Object.keys(currentUser).map((key) => {
                            if (key === 'doctor' || key === 'profile_image' || key === 'last_login' || key === 'user_id' || key == 'address')
                                return
                            return (
                                <span className='text-lg rounded px-3 py-2 ' key={key}>
                                    <h2 className=" font-bold ">{capitalize(key)}</h2>
                                    <p className=" text-gray-400 break-all">{currentUser[key]}</p>
                                </span>
                            )
                        })
                    }
                </div>
                <div className='grid grid-cols-1 gap-4 mt-3 '>
                    <span className='reletive  h-96 overflow-scroll  text-lg rounded '>
                        <h2 className=" font-bold sticky top-0 bg-gray-800 py-2 px-3">Address</h2>
                        <p className=" text-gray-400 py-2 px-3">{currentUser?.address}</p>
                    </span>
                </div>

                {
                    currentUser?.doctor ?
                    <div className='grid grid-cols-2 gap-4 mt-3 py-2 px-3'>
                        <span className='text-lg rounded '>
                            <h2 className=" font-bold  ">Specialization</h2>
                            <p className=" text-gray-400 ">{currentUser?.doctor?.specialization
                            }</p>
                        </span>
                        <span className='text-lg rounded '>
                            <h2 className=" font-bold  ">Department</h2>
                            <p className=" text-gray-400 ">{currentUser?.doctor?.department
                                .name}</p>
                        </span>
                        <span className='text-lg rounded '>
                            <h2 className=" font-bold  ">Head Id</h2>
                            <p className=" text-gray-400 ">{currentUser?.doctor?.department
                                .head_id ?? "-"}</p>
                        </span>
                        <span className='text-lg rounded '>
                            <h2 className=" font-bold  ">Available from</h2>
                            <p className=" text-gray-400 ">{convert24To12hour(currentUser?.doctor?.available_from)}</p>
                        </span>
                        <span className='text-lg rounded '>
                            <h2 className=" font-bold  ">Available to</h2>
                            <p className=" text-gray-400 ">{convert24To12hour(currentUser?.doctor?.available_to)}</p>
                        </span>
                    </div>
                    :
                    <></>
                }


            </div>

        </div>





    )
}


export default Profile;