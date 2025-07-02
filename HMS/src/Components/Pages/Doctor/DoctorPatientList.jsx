import { useSelector } from 'react-redux'
import IsDarkMode from '../../../utility/DarkDay';
import React, { useState, useEffect, useRef } from 'react';
import {  useLazyGetqueryQuery } from '../../../services/userAuthApi';
import { getToken } from '../../../services/LocalStorage'
import Loader from '../../Loader';
import { convert24To12hour } from '../../../utility/timeFormat'
import formatDate from '../../../utility/formatDate';
import doctoricon from '../../../Images/doctor.png'
import { Link, useLocation } from 'react-router-dom'

import { throttle } from 'lodash';

const DoctorPatientList = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const [backendMessage, setBackendMessage] = useState('')
    const [filterStatus, setFilterStatus] = useState('Scheduled')
    const [nextUrl, setNextUrl] = useState(null);
    const [patientLists, setPatientLists] = useState([])

    const [fetchAgainPatientLists, { isFetching }] = useLazyGetqueryQuery(); // built-in
    const patientListScroll = useRef(null);
    const [doctorName, setDoctorName] = useState('')
    const location = useLocation()

    const [isLoading, setIsLoading] = useState(false)

    // load more data
    const loadMoreAppoinments = async () => {

        if (!nextUrl || isFetching) return

        try {
            const res = await fetchAgainPatientLists({ url: `${nextUrl}`, token: getToken().access })
           
            setPatientLists(prev => {
                const booking_id = new Set(prev.map(item => item.booking_id));

                const filter = res.data.data.results.filter(item => {

                    return !booking_id.has(item.booking_id)

                })
                if (filter.length === 0) {
             
                    return prev; 
                }
                return [...prev, ...filter]

            })

            setNextUrl(res.data.data.next)


        } catch (error) {


        }
    }

    const handleChangeStatus = (e) => {
        const value = e.target.value

        if (value)
            setFilterStatus(value)

    }

    // Code for Infinite Scroll
    const handleScroll = (node) => {
        // scroll height(Height of the div container or which contain )
        const scrollHeight = node.scrollHeight;
        // viewable Hight(jo height screen par dikh raha hai.)
        const viewHeight = node.clientHeight
        // scrollTop return number of pixel that the document has been scrolled vertically
        const scrollTop = node.scrollTop

        if ((viewHeight + scrollTop + 1) >= scrollHeight) {

            loadMoreAppoinments()
        }

    };

    useEffect(() => {
        const node = patientListScroll.current
       
        if (!node) return
        const scrollHandler = () => handleScroll(node);
        node.addEventListener('scroll', scrollHandler);

        return () => {
            node.removeEventListener('scroll', scrollHandler)
        }
    }, [nextUrl])

    
    useEffect(() => {
        fetchAndSetAppointments()
    }, [location?.state, filterStatus])


    // again fetch list of appointment when status === completed
    const fetchAndSetAppointments = async () => {
        setIsLoading(true)
        try {
            const { data: patientList, isSuccess } = await fetchAgainPatientLists({
                url: `/appointment/showdoctorappoinment/?filter=${filterStatus}`,
                token: getToken().access
            });
            if (isSuccess && patientList?.data?.results) {
                setBackendMessage('');
                setPatientLists([...patientList.data.results])
                setNextUrl(patientList.data.next)

            } else {
                setBackendMessage(patientList?.message)
                setPatientLists(patientList.dataNotFound)
            }
            setDoctorName(patientList?.doctor_name)



        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    };


    if (patientLists.length === 0) {

        // when not available
        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <h1 className={`text-2xl overflow-hidden mt-24 px-10 font-bold `}>
                    <img src={doctoricon} alt={doctoricon} className={`mb-3 h-12 w-12  inline-block ${isDark ? 'invert-75' : ''}`} /> <span className="text-[#1db91d]">{doctorName}</span>
                </h1>
                <div className='h-[50vh] flex flex-col  items-center justify-center'>

                    <p className='font-bold text-2xl mt-3 text-[#1db91d]'>{backendMessage}</p>
                    <select className='group cursor-pointer  rounded-sm outline-none  py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border mb-3 sm:mb-3' value={filterStatus} onChange={handleChangeStatus} >
                        <option className={` text-center  ${IsDarkMode(isDark)}`} value="Scheduled">Scheduled</option>
                        <option className={` text-center  ${IsDarkMode(isDark)}`} value="Completed">Completed</option>
                    </select>
                </div>
            </div>
        )
    }
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
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>

                <h1 className={`text-2xl mt-24 px-10 font-bold `}>
                    <img src={doctoricon} alt={doctoricon} className={`mb-3 h-12 w-12  inline-block ${isDark ? 'invert-75' : ''}`} /> <span className="text-[#1db91d]">{doctorName}</span>
                </h1>



                <div className={`max-w-4xl mx-auto pb-4`}>

                    <select className='group cursor-pointer  rounded-sm outline-none  py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border mb-3 sm:mb-3'value={filterStatus} onChange={handleChangeStatus} >
                        <option className={` text-center  ${IsDarkMode(isDark)}`} value="Scheduled">Scheduled</option>
                        <option className={` text-center  ${IsDarkMode(isDark)}`} value="Completed">Completed</option>
                    </select>

                        {/* Table Header */}
                        <div className={`hidden sm:grid grid-cols-6 gap-4  ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-3 rounded-t mt-0`} >
                            <div>Patient Id</div>
                            <div>Patient Name</div>
                            <div>Date </div>
                            <div>Time</div>
                            <div>Status</div>
                            <div>Detailed</div>
                        </div>
                    <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `} style={{ willChange: 'transform' }} ref={patientListScroll} >

                        {
                            
                            patientLists.map((pl) => (
                                <div
                                    key={pl.booking_id}
                                    className={`grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 rounded shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                                >
                                    <div><span className="sm:hidden font-bold">Patient Id: </span>{pl.patient_id}</div>
                                    <div><span className="sm:hidden font-bold">Patient: </span>{pl.patient}</div>

                                    <div><span className="sm:hidden font-bold">Appointment Date: </span>{formatDate(pl.appointment_date)}</div>
                                    <div><span className="sm:hidden font-bold">Time: </span>{convert24To12hour(pl.appointment_time)}</div>
                                    <div><span className="sm:hidden font-bold">Status: </span>{pl.status}</div>
                                    <div><span className="sm:hidden font-bold">Detailed: </span>
                                        <Link to={`/patientdetails/${pl.booking_id}`} state={{ filterStatus }} className={`text-regal-blue underline underline-offset-2 cursor-pointer`}>Click here</Link>


                                    </div>

                                </div>
                            ))


                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default DoctorPatientList;