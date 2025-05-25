import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import styled from 'styled-components';
import Loader from "../Loader";
import { useCreateStaffQuery, useCreateStaffsMutation, useGetDoctorRefrenceQuery } from "../../services/userAuthApi";
import formatDate from "../../utility/formatDate";
import IsDarkMode from "../../utility/DarkDay";

const Staff = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        date_of_birth: "",
        password: "",
        password2: "",
        mobile: "",
        role: "Staff",
        address: "",
        gender: "",
        staff_type: "",


        specialization: "",
        department_name: "",
        department_head_id: "",
        available_from: "",
        available_to: ""


    });

  


    const { data: staff_choices } = useCreateStaffQuery()
    const { data: doctorRefrence } = useGetDoctorRefrenceQuery()
    const [staffRegisterUser, { isLoading }] = useCreateStaffsMutation()

    const genderOptions = ["--select--", ...(staff_choices?.gender_choices || [])];
    const staff_typeOptions = ["--select--", ...(staff_choices?.role_choices || [])];
    const doctorSpecilization = ["--select--", ...(doctorRefrence?.data || [])];
    const [error, setError] = useState({});
    const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });
    const doctorOnlyFields = ["available_from", "available_to", "specialization", "department_name", "department_head_id"];




    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedForm = { ...form, [name]: value };
        if (name === "specialization") {

            const selected = doctorSpecilization.find(item => item.specialization == value)
            
            if (selected) {
                updatedForm = {
                    ...updatedForm,
                    department_name: selected.department.name || "",
                    department_head_id: selected.department.head_id || "",
                    available_from: selected.available_from || "",
                    available_to: selected.available_to || "",
                };

            }else{
                updatedForm = {
                    ...updatedForm,
                    department_name: "",
                    department_head_id: "",
                    available_from: "",
                    available_to: "",
                };
            }

        }
        setForm(updatedForm);
        setError({ ...error, [name]: false });
        setToastMsg({ msg: '', severity: '' });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
        Object.keys(form).forEach(key => {

            if (!form[key] && (form.staff_type === "Doctor" ? true : !doctorOnlyFields.includes(key))) {
                if (key !== "department_head_id")
                    newError[key] = true;
            }

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
                doctor: form.staff_type === "Doctor" ? {
                    specialization: form.specialization,
                    department: {
                        name: form.department_name,
                        head_id: form.department_head_id || null
                    },
                    available_from: form.available_from,

                    available_to: form.available_to,
                } : undefined,
                date_of_birth: formatDate(form.date_of_birth)
            }
            delete submission.specialization
            delete submission.available_from
            delete submission.available_to
            delete submission.department_name
            delete submission.department_head_id


            const response = await staffRegisterUser(submission)
            console.log(response)
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
            console.log(err)
            setToastMsg({
                msg: "Something went wrong",
                severity: 'error'
            })
        }
        // navigate('/');
    };


    return (
        <div className={` flex items-center justify-center flex-wrap px-4 ${IsDarkMode(isDark)}`}>
            <StyledWrapper className="w-full max-w-6xl md:mt-2 md:mb-0 mt-10 mb-20  rounded-xl p-6  shadow-lg shadow-regal-dark-blue md:p-10">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Create a Staff Account</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", name: "name", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "Date of Birth", name: "date_of_birth", type: "date" },
                            { label: "Mobile", name: "mobile", type: "text" },
                            { label: "Password", name: "password", type: "password" },
                            { label: "Confirm Password", name: "password2", type: "password" },
                            { label: "Gender", name: "gender" },
                            { label: "Staff Type", name: "staff_type" },
                            { label: "Specialization", name: "specialization", type: "text" },
                            { label: "Department_Name", name: "department_name", type: "text" },
                            { label: "Department_Head Id", name: "department_head_id", type: "text" },
                            { label: "Available From", name: "available_from", type: "text" },
                            { label: "Available To", name: "available_to", type: "text" },
                        ].map(({ label, name, type }) => {
                            if (doctorOnlyFields.includes(name) && form.staff_type !== "Doctor") return
                            return (
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
                                        name === "staff_type"
                                            ?
                                            <select
                                                name={name}
                                                id={name}
                                                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                                value={form[name]}
                                                onChange={handleChange}
                                            >

                                                {staff_typeOptions.map((item) => (
                                                    <option key={item} value={item} >{item}</option>
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
                                                name === "specialization" ?
                                                    <select
                                                        name={name}
                                                        id={name}
                                                        className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                                        value={form[name]}
                                                        onChange={handleChange}
                                                    >

                                                        {doctorSpecilization.map((item, index) => (
                                                            index == 0 ?
                                                                <option key={index} value={item} >{item}</option>
                                                                :
                                                                <option key={index} value={item.specialization} >{item.specialization}</option>



                                                        ))}


                                                    </select>
                                                    :
                                                    <input
                                                        type={type}
                                                        name={name}
                                                        id={name}
                                                        className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
                                                        value={form[name]}
                                                        readOnly={['department_head_id', 'department_name', 'available_from', 'available_to'].includes(name)}
                                                        onChange={handleChange}
                                                    />




                                    }

                                    {error[name] && <span className='error_msg'>This Field Is Required!</span>}
                                </div>
                            )
                        })}

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


export default Staff;