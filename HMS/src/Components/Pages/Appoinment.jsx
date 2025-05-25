import { useSelector } from 'react-redux'
import IsDarkMode from '../../utility/DarkDay';
import { useGetAppoinmnetQuery } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorage'
import AppoinmentBook from './AppoinmentBook';
import { useState } from 'react';



const Appointment = () => {
  const isDark = useSelector(state => state.dark.isDark);
  const token = getToken().access
  const [isAppoinmentBook, setIsAppoinmentBook] = useState(false)

  const url = '/appointment/showappoinment/'
  const { data: appointments, isLoading } = useGetAppoinmnetQuery({ url, token })




  return (
    <>
      {isAppoinmentBook ? <AppoinmentBook setIsAppoinmentBook={setIsAppoinmentBook} /> :

        <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>
          <div className="max-w-4xl mx-auto mt-20">
            {/* Sticky Search Bar */}
            <div className={`${IsDarkMode(isDark)} pb-4`}>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex w-full sm:flex-1 border border-gray-300  rounded overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search by patient or doctor"
                    className={`w-full p-2 ${IsDarkMode(isDark)} focus:outline-none `}
                  />
                  <button className="bg-blue-500 p-2  text-white cursor-pointer" onClick={() => console.log("Search Button Clicked")}>
                    Search
                  </button>
                </div>
                <button className="group cursor-pointer rounded-sm outline-none flex justify-center items-center py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border" onClick={() => setIsAppoinmentBook(!isAppoinmentBook)}>
                  <span className='font-bold text-2xl mr-1 group-hover:rotate-90 duration-300 '>+</span> Book Appoinment
                </button>

              </div>
            </div>

            {/* Table Header */}
            <div className={`hidden sm:grid grid-cols-5 gap-4 mb-2 ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-2 rounded-t mt-4`}>
              <div>Patient Name</div>
              <div>Doctor</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
            </div>

            {/* Appointment Rows */}
            <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `}>

              {
                !isLoading ?
                  appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`grid grid-cols-1 sm:grid-cols-5 gap-4  p-2 rounded shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                    >
                      <div><span className="sm:hidden font-bold">Patient: </span>{appointment.patient}</div>
                      <div><span className="sm:hidden font-bold">Doctor: </span>{appointment.doctor}</div>
                      <div><span className="sm:hidden font-bold">Date: </span>{appointment.appointment_date}</div>
                      <div><span className="sm:hidden font-bold">Time: </span>{appointment.appointment_time}</div>
                      <div><span className="sm:hidden font-bold">Status: </span>{appointment.status}</div>
                    </div>
                  ))
                  :
                  <></>
              }

            </div>
          </div>
        </div>
      }
    </>

  );
};

export default Appointment;
