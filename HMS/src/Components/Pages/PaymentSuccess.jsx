import { useSelector } from 'react-redux'
import IsDarkMode from '../../utility/DarkDay';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const PaymentSuccess = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams=new URLSearchParams(location.search)
    const status=searchParams.get('status')
 
    useEffect(() => {
        
        Swal.fire({
            title: status==='success'?'Success':'Failed',
            text: status==='success'?'Appoinment Booked SuccessFull':'Payment failed! If any amount has been deducted, it will be refund within 5-6 working days.',
            icon: status==='success'?'success':'error',
            confirmButtonText: 'Click here',
            color: status==='success'?'#0ab8b7':'#E21618',
            iconColor: status==='success'?'#0ab8b7':'#E21618',
            theme: isDark ? `dark` : 'light',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: status==='success'?'#0ab8b7':'#E21618'
        }).then((result) => {
            if (result.isConfirmed) {
          
                navigate('/appointment')
            }
        })
    },[status])

  
    return (
        <>
            <div className={`min-h-screen overflow-hidden py-6 px-4 ${IsDarkMode(isDark)} `}></div>
        </>
    )
}

export default PaymentSuccess;

