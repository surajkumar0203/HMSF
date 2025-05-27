import { useSelector } from 'react-redux'
import IsDarkMode from '../../utility/DarkDay';
import { useGetAppointmentQuery } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorage'
import AppointmentBook from './AppointmentBook';
import { useState } from 'react';
import Loader from '../Loader';
import {convert24To12hour} from '../../utility/timeFormat'



const Appointment = () => {
  const isDark = useSelector(state => state.dark.isDark);
  const [isAppointmentBook, setIsAppointmentBook] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const { data: appointments, isLoading } = useGetAppointmentQuery({ url: `/appointment/showappoinment/?filter=${filterStatus}`, token: getToken().access })
  
  if (isAppointmentBook) {
    return (

      <AppointmentBook setIsAppointmentBook={setIsAppointmentBook} />

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
  if (appointments.dataNotFound?.length===0) {
    // when no appoinment available
    return (
      <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
        <div className='h-[94vh] flex flex-col items-center justify-center'>

          <button className="group cursor-pointer rounded-sm outline-none py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border" onClick={() => setIsAppointmentBook(!isAppointmentBook)}>
            <span className='font-bold text-2xl mr-1 group-hover:rotate-90 duration-300 '>+</span> Book Appoinment
          </button>
          <p className='font-bold text-2xl mt-3 text-[#1db91d]'>{appointments.message}</p>

        </div>
      </div>
    )
  }
  const handleSelectChange = (e) => {

    const value = e.target.value
    if (value !== 'Filter') {
      setFilterStatus(value)
    } else {
      setFilterStatus('')
    }
  }

  return (
    <>
      <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>
       
        <div className={`max-w-4xl mx-auto mt-20  pb-4`}>
          {/* Sticky Search Bar */}

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex w-full sm:flex-1 border border-gray-300  rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search by patient or doctor or Booking Id"
                className={`w-full p-2 ${IsDarkMode(isDark)} focus:outline-none `}
              />
              <button className="bg-blue-500 p-2  text-white cursor-pointer" onClick={() => console.log("Search Button Clicked")}>
                Search
              </button>
            </div>
            <div className='flex gap-1 flex-wrap'>
              <button className="group cursor-pointer rounded-sm outline-none  py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border mb-3 sm:mb-0" onClick={() => setIsAppointmentBook(!isAppointmentBook)}>
                <span className='font-bold text-2xl mr-1 group-hover:rotate-90 duration-300 '>+</span> Book Appoinment
              </button>


              <select className='group cursor-pointer rounded-sm outline-none  py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border mb-3 sm:mb-0' onChange={handleSelectChange}>
                <option className={` text-center  ${IsDarkMode(isDark)}`} value="Filter">Filter</option>
                <hr></hr>

                {
                  appointments.status.map((st, index) => (
                    <option className={`text-center ${IsDarkMode(isDark)}`} key={index} value={st}>
                      {st}
                    </option>


                  ))
                }
              </select>

            </div>
          </div>

          {/* Table Header */}
          <div className={`hidden sm:grid grid-cols-6 gap-4 mb-2 ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-2 rounded-t mt-4`}>
            <div>Booking Id</div>
            <div>Patient Name</div>
            <div>Doctor</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
          </div>

          {/* Appointment Rows */}
          <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `}>

            {
              appointments.searchNotFound?.length!==0?
              appointments.data.map((appointment) => (
                <div
                  key={appointment.booking_id}
                  className={`grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 rounded shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                >
                  <div><span className="sm:hidden font-bold">Booking Id: </span>{appointment.booking_id}</div>
                  <div><span className="sm:hidden font-bold">Patient: </span>{appointment.patient}</div>
                  <div><span className="sm:hidden font-bold">Doctor: </span>{appointment.doctor}</div>
                  <div><span className="sm:hidden font-bold">Date: </span>{appointment.appointment_date}</div>
                  <div><span className="sm:hidden font-bold">Time: </span>{convert24To12hour(appointment.appointment_time)}</div>
                  <div><span className="sm:hidden font-bold">Status: </span>{appointment.status}</div>

                </div>
              ))
              :
              <p className='font-bold  text-center text-lg text-[#1db91d]'>{appointments.message}</p>
            }

          </div>
        </div>
      </div>
    </>

  );
};

export default Appointment;
