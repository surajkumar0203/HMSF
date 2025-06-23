import { useSelector } from 'react-redux'
import styled from 'styled-components';
import Loader from '../Loader';
import { useState } from 'react';
import { useLoginMutation, useReSendLinkMutation } from '../../services/userAuthApi';
import { storeToken } from '../../services/LocalStorage';
import Alert from '@mui/material/Alert';
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@mui/material';
import IsDarkMode from '../../utility/DarkDay';
import { useDispatch } from "react-redux";
import { setUserID } from '../../features/storeUserID/storeUserIDSlice';
import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_ID_SECRET;

const Login = () => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()

    const dispatch = useDispatch();

    const [loginUser, { isLoading }] = useLoginMutation()
    const [resendlinkUser, { isLoading: loading }] = useReSendLinkMutation()

    const [form, setForm] = useState({
        user_id: '',
        password: ''
    })
    const [error, setError] = useState({
        user_id: false,
        password: false
    })
    const [toastMsg, setToastMsg] = useState({
        msg: '',
        severity: ''
    })

    const resendLink = async (email, user_id) => {
        setToastMsg({msg:'',severity: ''})
        try{
            const res = await resendlinkUser({ user_id, email })
            
            if(res.error){
                setToastMsg({
                    msg:res.error.data.error,
                    severity: 'error'
                })
            }else{
                setToastMsg({
                    msg:res.data.message,
                    severity: 'success'
                })
            }

        }catch(error){
            setToastMsg({
                msg: 'Something went wrong!',
                severity: 'error'
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            user_id: !form.user_id,
            password: !form.password
        })

        if (!form.user_id || !form.password)
            return;

        try {
            const response = await loginUser(form)
            if (response.error) {
                if (response.error.data.errors === "Please Activate Your Account") {
                        setToastMsg({
                                msg: (
                                    
                                    <>
                                        {response.error.data.errors} {' '}
                                        <Button
                                            onClick={() => resendLink(response.error.data.email, response.error.data.user_id)}
                                            style={{ textDecoration: 'underline', color: 'red' }}
                                        >
                                            resend link
                                        </Button>
                                    </>
                                    
                                ),
                                severity: 'error'
                            })
                }else{
                    setToastMsg({
                        msg:response.error.data.errors,
                        severity: 'error'
                    })
                }
            } else {
                storeToken(response.data.token)
                const id=response.data.user_id;
                const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
                dispatch(setUserID(encryptedId))
                localStorage.setItem('MedicareUserID', encryptedId);
                navigate('/home');
              
            }
        } catch (err) {
            console.log(err)
            setToastMsg({
                msg: 'Something went wrong!',
                severity: 'error'
            })
        }

    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${IsDarkMode(isDark)} px-4`}>
            <StyledWrapper className="w-full max-w-md  mt-32  rounded-xl p-6 shadow-lg shadow-regal-dark-blue md:p-10  ">
                <form className="form">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Sing-in to MediCare</h2>

                    <label htmlFor="email" className="label">
                        Email/UserID
                    </label>
                    <input type="text" name="email" id="email" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error.user_id ? 'error' : ''}`} placeholder="Email/UserID"
                        onChange={
                            (e) => {
                                setForm({ ...form, user_id: e.target.value })
                                setError({ ...error, user_id: false })
                                setToastMsg({
                                    msg: '',
                                    severity: ''
                                })
                            }
                        }

                        value={form.email}

                    />
                    {
                        error.user_id ?
                            <span className='error_msg'>This Field Is Required!</span>
                            :
                            <></>
                    }

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



                    <div className="w-full text-right mb-4">
                        <Link to='/forgotpassword' className="text-sm text-[#58bc82] hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <button type='submit' className='submit' onClick={handleSubmit}>
                        {
                            isLoading || loading ?
                                <div className="loader-wrapper">
                                    <Loader size="sm" />
                                </div>
                                :
                                'Login'
                        }
                    </button>
                    <p className="text-center mt-4 text-sm">
                        Don't have an account? <Link to="/register" className="text-[#58bc82] hover:underline">Sign up</Link>
                    </p>
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
  .form input[type="text"],
  .form input[type="password"] {
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

export default Login;
