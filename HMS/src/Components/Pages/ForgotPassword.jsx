import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Loader from '../Loader';
import { useState } from 'react';
import { useForgotPasswordMutation } from '../../services/userAuthApi';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom'
import IsDarkMode from '../../utility/DarkDay';

const ForgotPassword = () => {
    const isDark = useSelector(state => state.dark.isDark)


    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

    const [form, setForm] = useState({
        email: '',

    })
    const [error, setError] = useState({
        email: false,

    })
    const [toastMsg, setToastMsg] = useState({
        msg: '',
        severity: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            email: !form.email,

        })

        if (!form.email)
            return;
        
        try {

            const response = await forgotPassword(form)
            if (response.error && response.error.status === 429) {
                setToastMsg({
                    msg: response.error.data.error,
                    severity: 'error'
                })
                return;
            }
            if (response.error) {

           
                    setToastMsg({
                        msg: response.error.data.email[0],
                        severity: 'error'
                    })
         
            } else {
                setToastMsg({
                    msg: response.data.msg,
                    severity: 'success'
                })


            }
        } catch (err) {
            setToastMsg({
                msg: 'Something went wrong!',
                severity: 'error'
            })

        }

    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${IsDarkMode(isDark)} px-4`}>
            <StyledWrapper className="w-full max-w-md  mt-32  rounded-xl p-6 shadow-lg shadow-regal-dark-blue md:p-10  ">
                <form className="form" method='POST'>
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Verify Email</h2>

                    <label htmlFor="email" className="label">
                        Email/UserID
                    </label>
                    <input type="text" name="email" id="email" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error.email ? 'error' : ''}`} placeholder="Email/UserID"
                        onChange={
                            (e) => {
                                setForm({ ...form, email: e.target.value })
                                setError({ ...error, email: false })
                                setToastMsg({
                                    msg: '',
                                    severity: ''
                                })
                            }
                        }

                        value={form.email}

                    />
                    {
                        error.email ?
                            <span className='error_msg'>This Field Is Required!</span>
                            :
                            <></>
                    }

                    <div className="w-full text-right mb-4">
                        <Link to="/login" className="text-sm text-[#58bc82] hover:underline">
                            Login Page
                        </Link>
                    </div>
                    <button type='submit' className='submit' onClick={handleSubmit}>
                        {
                            isLoading ?
                                <div className="loader-wrapper">
                                    <Loader size="sm" />
                                </div>
                                :
                                'Verify Email'
                        }
                    </button>
                    <Alert severity={toastMsg.severity}>{toastMsg.msg}</Alert>
                </form>
            </StyledWrapper>
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
  .form input[type="text"]
   {
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
    cursor: pointer;
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

export default ForgotPassword;
