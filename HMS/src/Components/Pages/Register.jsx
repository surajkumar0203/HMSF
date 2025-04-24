import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const Register = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        date_of_birth: "",
        password: "",
        password2: "",
        mobile: "",
        role: Array(...["Patient", "Staff"]),
        address: "",
        gender: "Male",
        staff_type: ""
    });
    const genderOptions = ["Male", "Female", "Transgender"];
    const [error, setError] = useState({});
    const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setForm({ ...form, [name]: value });
        setError({ ...error, [name]: false });
        setToastMsg({ msg: '', severity: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newError = {};
        // console.log(form);
        Object.keys(form).forEach(key => {
            if (!form[key]) newError[key] = true;
        });
        setError(newError);

        // console.log("Submitted data", form);
        if (Object.keys(newError).length > 0) return;

        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-wrap px-4">
            <StyledWrapper className="w-full max-w-6xl md:mt-20 md:mb-0 mt-28 mb-20  rounded-xl p-6  shadow-lg shadow-regal-dark-blue md:p-10">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Create a Patient Account</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", name: "name", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "Date of Birth", name: "date_of_birth", type: "date" },
                            { label: "Mobile", name: "mobile", type: "text" },
                            { label: "Password", name: "password", type: "password" },
                            { label: "Confirm Password", name: "password2", type: "password" },
                            { label: "Gender", name: "gender",  },
    
                        ].map(({ label, name, type }) => (
                            <div key={name}>
                                <label htmlFor={name} className="label">{label}</label>
                                {
                                    name === "gender"
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
                                        <input
                                            type={type}
                                            name={name}
                                            id={name}
                                            className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}

                                            value={
                                               form[name]
                                            }
                                            onChange={handleChange}

                                        />
                                }
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
                                onChange={handleChange}
                            />
                            {error.address && <span className='error_msg'>This Field Is Required!</span>}
                        </div>
                    </div>

                    <button type='submit' className='submit mt-6'>
                        Register
                    </button>
                    <p className="text-center mt-4 text-sm">
                        Already have an account? <Link to="/login" className="text-[#58bc82] hover:underline">Login</Link>
                    </p>
                    {toastMsg.msg && <Alert severity={toastMsg.severity}>{toastMsg.msg}</Alert>}
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
  }

  .form input, .form textarea, .form select {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    border: none;
    outline: 2px solid var(--bg-dark);
  }

  .label {
    font-weight: 600;
    color: var(--clr);
    margin-bottom: 0.25rem;
    display: block;
  }

  .error {
    outline: 2px solid red !important;
  }

  .error_msg {
    color: red;
    font-size: 0.75rem;
  }

  .submit {
    padding: 0.75rem;
    border-radius: 999px;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: var(--clr);
    color: var(--bg-dark);
  }
`;

export default Register;
