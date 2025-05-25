import logo from '../Images/hospital_logo.png'
import { NavLink, useNavigate } from "react-router-dom"
import DarkModeToggle from './DarkModeToggle'
import { useSelector } from 'react-redux'
import Hamburger from './Hamburger'
import { useState } from 'react'

import { getToken } from "../services/LocalStorage"


import ProfileDropdown from './Pages/ProfileDropdown'

const Headers = () => {
    const isDark = useSelector(state => state.dark.isDark)
    const [isSliderbarOpen, setIsSliderbarOpen] = useState(false)
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSliderbarOpen((prev) => !prev)

    }


    return (
        <>
            <header className={`flex fixed w-full top-0 items-center  justify-between  ${isDark ? 'bg-regal-dark-blue text-[azure]' : 'bg-regal-blue text-[black]'}`}>

                <div>
                    <p className="text-2xl font-bold flex items-center">
                        <span >
                            <img src={logo} alt={logo} className='w-20' />
                        </span>
                        <span className='text-black'>Medi</span><span className='text-red-700'>Care</span>
                    </p>
                </div>

                <nav className={`flex justify-between p-2 text-xl gap-x-5 gap-y-5 relative`}>

                    <ul className='hidden md:flex gap-x-5 items-center md:text-lg'>

                        <li>
                            {
                                1 ?
                                    <NavLink className="group transition duration-300" to="/appoinment"
                                        style={({ isActive }) => ({

                                            fontWeight: isActive ? "bold" : ""
                                        })}
                                    >Appoinment
                                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal"></span>
                                    </NavLink>
                                    :
                                    <></>
                            }
                        </li>

                        <li>
                            <NavLink className="hover:text-gray-700 group transition duration-300" to="/contactus"
                                style={({ isActive }) => ({
                                    fontWeight: isActive ? "bold" : ""
                                })}
                            >Contact-us
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal"></span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className="hover:text-gray-700 group transition duration-300" to="/aboutus"
                                style={({ isActive }) => ({
                                    fontWeight: isActive ? "bold" : ""
                                })}
                            >About-us
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-dark-teal"></span>
                            </NavLink>
                        </li>
                        <li>
                            {
                                !getToken().access ?

                                    <button className="text-black bg-white hover:bg-gray-400 py-2 px-3  rounded-2xl cursor-pointer" onClick={() => navigate('/login')}>Login</button>
                                    :
                    
                                    <ProfileDropdown/>
                                    
        
      
                            }
                        </li>

                    </ul>

                    {/* Mobile Sidebar */}
                    <div className={`fixed top-20 right-0 h-screen w-64 ${!isDark ? 'bg-regal-trans-blue' : 'bg-regal-dark-trans-blue'} z-50 transform transition-transform duration-300 ease-in-out  ${isSliderbarOpen ? "translate-x-0" : "translate-x-full"
                        } md:hidden`} onClick={toggleSidebar}>

                        <ul className="flex flex-col gap-y-6 p-4 text-2xl ">
                            <li>
                                {
                                    getToken().access ?
                                        <NavLink className="block py-2 opacity-95 hover:text-gray-300 transition" to="/appoinment" style={({ isActive }) => ({
                                            fontWeight: isActive ? "bold" : ""
                                        })}>
                                            Appointment
                                        </NavLink>
                                        :
                                        <></>
                                }
                            </li>
                            <li>
                                <NavLink className="block py-2 hover:text-gray-300 transition" to="/contactus" style={({ isActive }) => ({
                                    fontWeight: isActive ? "bold" : ""
                                })}>
                                    Contact-us
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="block py-2 hover:text-gray-300 transition" to="/aboutus" style={({ isActive }) => ({
                                    fontWeight: isActive ? "bold" : ""
                                })}>
                                    About-us
                                </NavLink>
                            </li>
                            <li>
                                {
                                    !getToken().access ?
                                        <button className="block py-2 hover:text-gray-300 transition cursor-pointer" onClick={()=>navigate("/login")} >
                                            Login
                                        </button>
                                        :
                                        
                                        // <button  className="block py-2 hover:text-gray-300 transition cursor-pointer" onClick={
                                        //     ()=>{
                                        //       removeToken()
                                        //       navigate('/login')  
                                        //     }
                                        // } >
                                        //     Logout
                                        // </button>
                                        <ProfileDropdown/>
                                }
                            </li>
                        </ul>
                    </div>
                    <DarkModeToggle />
                    <div className="md:hidden " onChange={toggleSidebar}>
                        <Hamburger />
                    </div>
                </nav>

            </header>

        </>
    )
}

export default Headers;