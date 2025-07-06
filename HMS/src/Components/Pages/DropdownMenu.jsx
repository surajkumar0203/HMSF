import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeToken } from '../../services/LocalStorage';
import { Link, useNavigate } from "react-router-dom"
import IsDarkMode from '../../utility/DarkDay';
import { useSelector, useDispatch } from 'react-redux'
import { clearUserID } from '../../features/storeUserID/storeUserIDSlice';
import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_ID_SECRET;
const URL = import.meta.env.VITE_ID_BACKEND_URL

const DropdownMenu = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const User = useSelector(state => state.currentUser.currentUser)
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [currentUser,setCurrentUser] = useState({})

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    
    useEffect(()=>{
        if(User){
            const bytes = CryptoJS.AES.decrypt(User, secretKey);
            const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
            const jsonParse=JSON.parse(decryptedId)
            setCurrentUser(jsonParse)
        }
    },[User])
    
    return (
        
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Profile Image */}
            <img
                src={`${URL}${currentUser?.profile_image}`}
                alt={currentUser?.profile_image}
                className="w-10 h-10 rounded-full cursor-pointer border"
                onClick={toggleDropdown}
                loading="lazy"
            />
            
            {/* Animated Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 1 }}
                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.1 }}
                        className={`absolute right-0 mt-2 w-64  rounded-md shadow-lg border z-50  ${IsDarkMode(isDark)}`}
                    >
                        <div className="py-2 px-4">
                            <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
                            <p className="text-sm text-gray-600">{currentUser?.user_id}</p>
                        </div>
                        <hr />
                        <ul className="py-1">

                            <Link to="/profile" className='group' state={{ currentUser }}>
                                <li className="group px-4 py-2 hover:bg-red-700 cursor-pointer hover:text-gray-300 text-amber-800">
                                    My Profile
                                </li>
                            </Link>

                            <Link to="/profile" className='group' state={{ currentUser }}>
                                <li className="px-4 py-2 hover:bg-red-700 cursor-pointer hover:text-gray-300 text-amber-800">Settings</li>
                            </Link>
                            <button className="w-full text-left   cursor-pointer" onClick={
                                () => {
                                    dispatch(clearUserID())
                                    navigate('/login')
                                    removeToken()
                                }
                            } >
                                <li className="group px-4    py-2 hover:bg-red-700 cursor-pointer hover:text-gray-300 text-amber-800">
                                    Logout
                                </li>
                            </button>

                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownMenu;
