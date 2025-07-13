import { useState, useEffect,useCallback } from "react";
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import styled from 'styled-components';
import { useRegisterPatientMutation, useCreatePatientQuery } from "../../services/userAuthApi";
import Loader from "../Loader";
import formatDate from "../../utility/formatDate";
import IsDarkMode from "../../utility/DarkDay";



const Patient = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const navigate = useNavigate();
    const [patientRegisterUser, { isLoading }] = useRegisterPatientMutation()
    const { data: patient_choices } = useCreatePatientQuery()
    const [form, setForm] = useState({
        name: "",
        email: "",
        date_of_birth: "",
        password: "",
        password2: "",
        mobile: "",
        role: "Patient",
        address: "",
        gender: "",
        city:"",
        state:"",
        pin_code:""
    });
    const genderOptions = ["--select--", ...(patient_choices?.gender_choices || [])];
    const [error, setError] = useState({});
    const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });

    useEffect(() => {
        if (toastMsg.msg) {
            const timer = setTimeout(() => {
                setToastMsg({ msg: '', severity: '' });
            }, 2000);
            // Cancels the pending setTimeout if the component unmounts or the toastMsg changes before the 2 seconds.
            // Prevents a call to setToastMsg on an unmounted component, which can cause warnings or bugs.
            // If the component unmounts quickly, the timeout still runs.
            return () => clearTimeout(timer); // Cleanup on unmount or re-render
        }
    }, [toastMsg])



    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        if(name==='pin_code'  && value.length>6)
            return
        if(name==='mobile' && value.length>10 )
            return


        setForm({ ...form, [name]: value });
        setError({ ...error, [name]: false });
        setToastMsg({ msg: '', severity: '' });
    },[form,error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
        Object.keys(form).forEach(key => {
            if (!form[key]) newError[key] = true;
        });
        setError(newError);
        if (Object.keys(newError).length > 0) return;


        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (form.password != form.password2) {
            setToastMsg({
                msg: 'Password and Confirm Password must be equal',
                severity: 'error'
            })
            return
        }
        if (!regex.test(form.password)) {
            setToastMsg({
                msg: `Password must contain:
                - One Uppercase,
                - One Lowercase,
                - One Digit
                - One Special character, 
                - Minimum 8 characters`,
                severity: 'error'
            })
            return
        }


        try {
            const submission = {
                ...form,
                date_of_birth: formatDate(form.date_of_birth)
            }
            const response = await patientRegisterUser(submission)
            if (response.error) {
                setToastMsg({
                    msg: "This email address already exists.",
                    severity: 'error'
                })
            } else {
                setToastMsg({
                    msg: response.data.message,
                    severity: 'success'
                })
                navigate('/login')
            }

        } catch (err) {

            setToastMsg({
                msg: "Something went wrong",
                severity: 'error'
            })
        }

    };
    return (
        <div className={`flex items-center justify-center flex-wrap px-4 ${IsDarkMode(isDark)}`}>
            <StyledWrapper className="w-full max-w-6xl md:mt-2 md:mb-0 mt-10 mb-20  rounded-xl p-6  shadow-lg shadow-regal-dark-blue md:p-10">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Create a Patient Account</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", name: "name", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "Date of Birth", name: "date_of_birth", type: "date" },
                            { label: "Mobile", name: "mobile", type: "number" },
                            { label: "Password", name: "password", type: "password" },
                            { label: "Confirm Password", name: "password2", type: "password" },
                            { label: "Gender", name: "gender", },
                            { label: "City", name: "city", type: "text" },
                            { label: "State", name: "state", type: "text" },
                            { label: "Pin Code", name: "pin_code", type: "number" },
                        ].map(({ label, name, type }) => (
                            <div key={name}>
                                <label htmlFor={name} className="label">{label}</label>
                                {name === "gender"
                                    ?
                                    <select
                                        name={name}
                                        id={name}
                                        className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                        value={form[name]}
                                        onChange={handleChange}
                                    >


                                        {genderOptions.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}


                                    </select>
                                    :
                                    name === "date_of_birth" ?
                                        <input
                                            type={type}
                                            name={name}
                                            id={name}
                                            className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                                            max={new Date(new Date().setDate(new Date().getDate())).toISOString().split("T")[0]}
                                            value={form[name]}

                                            onChange={handleChange} />
                                        :
                                        <input
                                            type={type}
                                            name={name}
                                            id={name}
                                            className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                            autoComplete='on'
                                            
                                            value={form[name]}
                                            onChange={handleChange} />}
                                {error[name] && <span className='error_msg'>This Field Is Required!</span>}
                            </div>
                        ))}
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="label">Address</label>
                            <textarea
                                name="address"
                                id="address"
                                rows="2"
                                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error.address ? 'error' : ''}`}
                                value={form.address}
                                onChange={handleChange} />
                            {error.address && <span className='error_msg'>This Field Is Required!</span>}
                        </div>
                    </div>

                    <button type='submit' className='submit '>
                        {
                            isLoading ?
                                <div className="loader-wrapper">
                                    <Loader size="sm" />
                                </div>
                                :
                                'Register'
                        }
                    </button>
                    {
                        toastMsg.msg ?
                            <div className="flex justify-center relative">

                                {toastMsg.msg && <Alert severity={toastMsg.severity} style={{ whiteSpace: 'pre-line' }} className="absolute" >{toastMsg.msg}</Alert>}

                            </div>
                            :
                            <></>
                    }
                    <p className="text-center mt-4 text-sm">
                        Already have an account? <Link to="/login" className="text-[#58bc82] hover:underline">Login</Link>
                    </p>
                </form>
            </StyledWrapper>
        </div>
    );
}

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
export default Patient;

