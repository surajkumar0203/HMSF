import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IsDarkMode from '../../utility/DarkDay';
import deleteWindow from '../../Images/delete.png'
import styled from 'styled-components';
import { useGetAppointmentQuery, useAppointmentBookMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorage'
import Loader from '../Loader';
import { useState, useEffect, use } from 'react';
import isDoctorAvailable from '../../utility/isDoctorAvailable';
import Alert from '@mui/material/Alert';
import formatDate from '../../utility/formatDate';


const AppointmentBook = ({ setIsAppointmentBook }) => {

  const isDark = useSelector(state => state.dark.isDark)
  const navigate = useNavigate()
  const { data: appointments, isLoading } = useGetAppointmentQuery({ url: `/appointment/createappoinment/`, token: getToken().access })
  const [appointmentsBook, { isLoading: Bookloading }] = useAppointmentBookMutation()


  const closeWindow = () => {
    setIsAppointmentBook(false)
  }


  const [form, setForm] = useState({
    DRid: "",
    name: "",
    leave_end_date: "",
    leave_from_date: "",
    appointment_date: "",

    fee: "",
    doctor_details: "",
    specialization: ""

  });
  const [isAvailable, setIsAvailable] = useState(false)
  const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });

  const appoinmentBookings = ["--select--", ...(appointments?.data || [])];
  const [error, setError] = useState({});
  const [isSelected, setIsSelected] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...form, [name]: value };

    if (name === "DRid") {
      const selected = appointments.data.find(item => item.DRid == value)

      if (selected) {

        updatedForm = {
          ...updatedForm,
          DRid: selected.DRid,
          name: selected.name,
          leave_end_date: selected?.leave_end_date,
          leave_from_date: selected?.leave_from_date,
          specialization: selected?.specialization,
          fee: selected?.fee,
          doctor_details: selected?.doctor_details
        }
        setIsSelected(true)

      } else {
        updatedForm = {
          ...updatedForm,
          DRid: "",
          name: "",
          leave_end_date: "",
          leave_from_date: "",
          specialization: "",
          fee: "",
          doctor_details: ""
        }
        setIsSelected(false)

      }
    }
    setForm(updatedForm);
    setError({ ...error, [name]: false })
    setToastMsg({
      msg: '',
      severity: ''
    })
    setIsAvailable(false)
  }

  useEffect(() => {
    const checkIsDoctorAvailable = () => {
      let leave_from_date = form.leave_from_date;
      let leave_end_date = form.leave_end_date;
      let appointment_date = form.appointment_date

      if (leave_from_date && leave_end_date && appointment_date) {
        const date = isDoctorAvailable(appointment_date, leave_from_date, leave_end_date);
        if (date != "Invalid Date" && date != 'Doctor Is Avilable') {
          setToastMsg({
            msg: date,
            severity: 'error'
          })
          setIsAvailable(true)
        }
      }
    }
    checkIsDoctorAvailable();
  }, [form.leave_end_date, form.leave_from_date, form.appointment_date])


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      }
      script.onerror = () => {
        resolve(false);
      }
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isAvailable) return


    const newError = {};
    Object.keys(form).forEach((key) => {
      if ((key === "appointment_date" || key === 'DRid') && (!form[key] || form[key] === "--select--")) {
        newError[key] = true
      }
    })


    setError(newError)
    if (Object.keys(newError).length > 0) {
      return
    }

    //  api call
    try {
      const submission = {
        ...form,
        'doctor': form['DRid'],
        'appointment_date': formatDate(form['appointment_date'])
      }
      delete submission.leave_end_date
      delete submission.leave_from_date
      delete submission.name
      delete submission.DRid
      delete submission.fee
      delete submission.doctor_details
      delete submission.specialization

      const url = '/appointment/createappoinment/'
      const token = getToken().access
      const response = await appointmentsBook({ url, token, submission })
  
      if (response?.error?.status) {
        setToastMsg({
          msg: response?.error?.data?.error,
          severity: 'error'
        })
      }
      else if (response?.data?.status === 201) {
        const RazorpayOrderOptions = {
          ...response.data.data,
        }
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setToastMsg({
            msg: "Payment failed! If any amount has been deducted, it will be refunded within 5-6 working days.",
            severity: 'error'
          })
          return;
        }
        const razorpayInstance = new window.Razorpay(RazorpayOrderOptions);
        
        razorpayInstance.open();
        // when payment failed
        
        razorpayInstance.on('payment.failed', async (response) => {
          const submission = {
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,

          }

          const res = await appointmentsBook({ url: "/appointment/paymentfailure/", token, submission })
          setToastMsg({
            msg: res.data.error,
            severity: 'error'
          })
      

        })
      }

    } catch (e) {
      console.log(e)
    }
  }



  return (
    <div className={`min-h-screen overflow-hidden  ${IsDarkMode(isDark)} px-4`}>
      <div className=' mt-24 flex justify-end '>
        <button onClick={closeWindow} className=' cursor-pointer  '>
          <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow} />
        </button>
      </div>


      <div className='flex items-center justify-center flex-wrap px-4'>
        <StyledWrapper className="w-[30rem] max-w-6xl md:mt-36 md:mb-0 mt-28 mb-20  rounded-xl p-6  shadow-lg shadow-regal-dark-blue md:p-10">

          <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Book Appointment</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

            {
              isLoading ?
                <Loader />
                :

                <>
                  <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="DRid" className="label">Select Doctor</label>
                    <select
                      name="DRid"
                      id="DRid"
                      className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `}

                      onChange={handleChange}
                    >


                      {
                        appoinmentBookings.map((item, index) => (
                          index == 0 ?
                            <option key={index} value={item} >{item}</option> :
                            <option key={item.DRid} value={item.DRid}>{item.name}</option>
                        ))
                      }


                    </select>
                    {error['DRid'] && <span className='error_msg'>This Field Is Required!</span>}

                    <label htmlFor="appointment_date" className="label">Appoinment Date</label>
                    <input
                      type="date"
                      name="appointment_date"
                      id="appointment_date"
                      className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `}
                      min={appointments.date.startdate}
                      max={appointments.date.enddate}

                      onChange={handleChange}

                    />
                    {error['appointment_date'] && <span className='error_msg'>This Field Is Required!</span>}
                    {
                      isSelected ?
                        <>
                          <p className="label">Specialization</p>
                          <p className={`${isDark ? 'bg-gray-800 text-white outline-2 outline-[#444]' : 'bg-white text-black outline-2 outline-black'}  p-3 rounded-[10px]`}>{form.specialization}</p>

                          <p className="label">Doctor Details</p>
                          <p className={`${isDark ? 'bg-gray-800 text-white outline-2 outline-[#444]' : 'bg-white text-black outline-2 outline-black'}  p-3 rounded-[10px] overflow-auto h-72`}>{form.doctor_details}</p>
                        </>
                        :
                        <></>
                    }

                    <button type='submit' id="rzp-button1" className={`submit mt-5 ${isAvailable ? "cursor-not-allowed" : "cursor-pointer "}`} disabled={isAvailable} >
                      {
                        Bookloading ?
                          <div className="loader-wrapper">
                            <Loader size="sm" />
                          </div>
                          :
                          <p>Book Appoinment {isSelected ? <span className='text-red-700'>Pay : ₹ {form.fee}</span> : <></>}</p>
                      }

                    </button>
                    {
                      toastMsg.msg ?
                        <div className="flex justify-center ">


                          {toastMsg.msg && <Alert severity={toastMsg.severity} style={{ whiteSpace: 'pre-line' }}  >{toastMsg.msg}</Alert>}

                        </div>
                        :
                        <></>
                    }
                  </form>
                </>


            }
          </div>

        </StyledWrapper>
      </div>


    </div>
  );
};
const StyledWrapper = styled.div`
  .form {
    --bg-light: #efefef;
    --bg-dark: #444;
    --clr: #58bc82;
    --clr-alpha: #9c9c9c60;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  
  }
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
  .form input, .form textarea, .form select {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
   
    border: none;
    outline: 2px solid var(--bg-dark);
  }

 .error{
    outline: 2px solid red !important;
}

    .error_msg{
        color: red;
        font-size: 0.8rem;
    }

  .label {
    font-weight: 600;
    color: var(--clr);
  }

  .form .submit {
    padding: 0.75rem;
    width: 100%;
    border-radius: 999px;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    font-weight: 600;
    font-size: 1rem;
    transition: background-color 0.3s ease;

 display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem; 
    
  }

  .form .submit:hover {
     background-color: var(--clr);
     color: var(--bg-dark);
  }
`;


export default AppointmentBook;
