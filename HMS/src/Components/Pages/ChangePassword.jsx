import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import Loader from '../Loader';
import { useState } from 'react';
import { useChangePasswordMutation } from '../../services/userAuthApi';
import Alert from '@mui/material/Alert';
import {useNavigate,Link,useParams} from 'react-router-dom'
import IsDarkMode from '../../utility/DarkDay';

const ChangePassword = () => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()
    const {uid,token} = useParams()
  
    const [changePassword,{isLoading}]=useChangePasswordMutation()
    
    const [form, setForm] = useState({
        password: '',
        password2: '',
       
    })
    const [error, setError] = useState({
        password: false,
        password2: false,
  
    })
    const [toastMsg, setToastMsg] = useState({
        msg: '',
        severity: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            password: !form.password,
            password2: !form.password2,
          
        })

        if (!form.password || !form.password2) 
            return;
        
        try{
           
            const response = await changePassword({form,uid,token})
            console.log(response)
            if(response.error){
                setToastMsg({
                    msg: response.error.data.errors[0],
                    severity: 'error'
                   
                })
            }else{
                setToastMsg({
                    msg: response.data.msg,
                    severity: 'success'
                })
                setTimeout(() => {
                    navigate('/login')
                },2000)

            }
        }catch (err){
            setToastMsg({
                msg: 'Something went wrong!',
                severity: 'error'
            })
        }
            
    }

    return (
        <div className={`min-h-screen flex items-center justify-center  ${IsDarkMode(isDark)} px-4`}>
            <StyledWrapper className="w-full max-w-md  mt-32  rounded-xl p-6 shadow-lg shadow-regal-dark-blue md:p-10  ">
                <form className="form" method='POST'>
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Change Password</h2>

                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input type="password" name="password" id="password" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error.password ? 'error' : ''}`} placeholder="Password"
                        onChange={
                            (e) => {
                                setForm({ ...form, password: e.target.value })
                                setError({ ...error, password: false })
                                setToastMsg({
                                    msg: '',
                                    severity: ''
                                })
                            }
                        }

                        value={form.password}

                    />
                    {
                        error.password ?
                            <span className='error_msg'>This Field Is Required!</span>
                            :
                        <></>
                    }

                    <label htmlFor="confirm_password" className="label">
                        Confirm Password
                    </label>
                    <input type="password" name="password2" id="confirm_password" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error.password2 ? 'error' : ''}`} placeholder="Confirm Password"
                        onChange={
                            (e) => {
                                setForm({ ...form, password2: e.target.value })
                                setError({ ...error, password2: false })
                                setToastMsg({
                                    msg: '',
                                    severity: ''
                                })
                            }
                        }

                        value={form.password2}

                    />
                    {
                        error.password2 ?
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
                                'Update Password'
                        }
                    </button>
                    
                    <Alert severity={toastMsg.severity}>{toastMsg.msg}
                        {
                            toastMsg.severity==="success"?
                            <Link to="/login" className="text-sm text-[#181b0b] hover:underline pl-4"> 
                                     Click Here 
                            </Link>
                            :
                            <></>
                        }
                    </Alert>
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
  .form input[type="password"], 
  .form input[type="password2"]
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

export default ChangePassword;
