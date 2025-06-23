import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from '../../Images/profile.png'
import { removeToken } from '../../services/LocalStorage';
import { useNavigate } from "react-router-dom"
import IsDarkMode from '../../utility/DarkDay';
import { useSelector,useDispatch } from 'react-redux'
import { clearUserID } from '../../features/storeUserID/storeUserIDSlice';

const ProfileDropdown = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const dispatch=useDispatch()
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
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

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Profile Image */}
            <img
                src={profilePic}
                alt={profilePic}
                className="w-10 h-10 rounded-full cursor-pointer border"
                onClick={toggleDropdown}
            />

            {/* Animated Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-2 w-64  rounded-md shadow-lg border z-50  ${IsDarkMode(isDark)}`}
                    >
                        <div className="py-2 px-4">
                            <h2 className="text-lg font-semibold">Suraj Kumar</h2>
                            <p className="text-sm text-gray-600">Web Developer</p>
                        </div>
                        <hr />
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-red-700 cursor-pointer text-amber-800">My Profile</li>
                            <li className="px-4 py-2 hover:bg-red-700 cursor-pointer text-amber-800">Settings</li>
                            <li className="px-4 py-2 hover:bg-red-700 cursor-pointer text-amber-800">

                                <button className="w-full text-left  hover:text-gray-300 transition cursor-pointer" onClick={
                                    () => {
                                        dispatch(clearUserID())
                                        navigate('/login')
                                        removeToken()
                                    }
                                } >
                                    Logout
                                </button>
                            </li>

                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
