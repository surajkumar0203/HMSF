import { useState, useCallback, useEffect,useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Alert from '@mui/material/Alert';
import deleteWindow from '../../Images/delete.png'
import IsDarkMode from '../../utility/DarkDay';
import Loader from "../Loader";
import { useProfileUpdateMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorage';

const initialFormState = {
  address: '',
  city: '',
  state: '',
  pin_code: '',
  // profile_image: null,
};

const ProfileUpdate = ({seIsProfileUpdate,isDoctor}) => {
  const isDark = useSelector(state => state.dark.isDark);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState({});
  const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });

  const [updateRecord, { isLoading }] = useProfileUpdateMutation();

  const arrayField=useMemo(()=>{
      const field=[
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Pin Code", name: "pin_code", type: "number" },
        ]

          if(isDoctor)
            field.push({ label: "Upload Profile", name: "profile_image", type: "file" })
        return field;
  },[isDoctor])



  
    const handleChange = useCallback((e) => {
    setToastMsg({ msg: '', severity: '' });

    const { name, value, files } = e.target;
    if (name === 'pin_code' && value.length > 6) return;

    const updatedForm = { ...form };

    if (name === 'profile_image') {
      const file = files[0];

      if (!file.type.includes('jpeg')) {
        setError({ ...error, [name]: true, msg: 'Only JPEG images are allowed.' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError({ ...error, [name]: true, msg: 'Image must be less than 10MB.' });
        return;
      }

      setError(prev => ({ ...prev, [name]: false }));
      updatedForm[name] = file;
    } else {
      updatedForm[name] = value;
    }

    setForm(updatedForm);
  }, [form, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(form).every(key => form[key] === '' || form[key] === null)) {
      setToastMsg({ msg: "Empty Field Not Allowed", severity: 'error' });
      return;
    }
   
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) 
        formData.append(key, value);
    });

    try {
      const response = await updateRecord({
        url: isDoctor?'staff/updateprofilestaff/':'patient/updateprofilepatient/',
        token: getToken().access,
        body: formData,
      });
   
      if (response?.error?.status === 404) {
        const pinCodeError = response?.error?.data?.error?.pin_code?.error;
        setToastMsg({ msg: pinCodeError || 'Invalid input', severity: 'error' });
        return;
      }

      setToastMsg({ msg: response?.data?.message, severity: 'success' });

      setTimeout(() => navigate('/home'), 2000);

    } catch (err) {
      setToastMsg({ msg: "Something went wrong", severity: 'error' });
    }
  };

  const renderInput = ({ label, name, type }) => (
    <div key={name}>
      <label htmlFor={name} className="label">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${error[name] ? 'error' : ''}`}
        autoComplete="on"
        value={type !== 'file' ? form[name] : undefined}
        onChange={handleChange}
      />
      {error[name] && <span className='error_msg'>{error.msg}</span>}
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center flex-wrap px-4 ${IsDarkMode(isDark)}`}>
      <StyledWrapper className="w-full max-w-2xl mt-30 mb-20 rounded-xl p-6 shadow-lg shadow-regal-dark-blue md:p-10">
      <div className='  flex justify-end '>
              <button  className=' cursor-pointer' onClick={()=>seIsProfileUpdate(prev=>!prev)}>
                <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow} />
              </button>
            </div>
        {/* <h2>dd</h2> */}
        <form onSubmit={handleSubmit} className="form">
          <h2 className="text-2xl font-bold  text-center text-[#58bc82]">Update Your Profile</h2>
          <div className="md:col-span-2">
            <label htmlFor="address" className="label">Address</label>
            <textarea
              name="address"
              id="address"
              rows="2"
              value={form.address}
              className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
              onChange={handleChange}
            />
          </div>

          {arrayField.map(renderInput)}

          <button type="submit" className="submit mt-4">
            {isLoading ? <Loader size="sm" /> : 'Update Profile'}
          </button>

          {toastMsg.msg && (
            <div className="flex justify-center relative mt-2">
              <Alert severity={toastMsg.severity} style={{ whiteSpace: 'pre-line' }} className="absolute">
                {toastMsg.msg}
              </Alert>
            </div>
          )}
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

  .form input, .form textarea {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    border: none;
    outline: 2px solid var(--bg-dark);
  }

  .error {
    outline: 2px solid red !important;
  }

  .error_msg {
    color: red;
    font-size: 0.8rem;
  }

  .label {
    font-weight: 600;
    color: var(--clr);
  }

  .submit {
    padding: 0.75rem;
    width: 100%;
    border-radius: 999px;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;

    &:hover {
      background-color: var(--clr);
      color: var(--bg-dark);
    }
  }
`;

export default ProfileUpdate;
