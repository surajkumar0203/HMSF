import styled from 'styled-components';
import { usePostQueryMutation } from '../../../services/userAuthApi';
import { getToken } from '../../../services/LocalStorage'
import { useState,useCallback } from 'react';
import Loader from '../../Loader';
import Alert from '@mui/material/Alert';



const AddPrescriptionInfoDoctor = ({ setToggle,AddPrescriptionRecord,refreshPrescriptionRecords,amtID }) => {
    const [AddPrescriptionInfo, { isLoading }] = usePostQueryMutation()
  
    const [form, setForm] = useState({
        medication_details: '',
      
    })
    const [error, setError] = useState({});

    

    const handleChange = useCallback((e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value })
        setError({ ...error, [name]: false })
    },[form,setError])

    const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });
    
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
     
        const newError = {};
        Object.keys(form).forEach(key => {
            if (!form[key]) {
                newError[key] = true;
            }
        })
        setError(newError)
        if (Object.keys(newError).length > 0) return
        
        try {
           
            const response = await AddPrescriptionInfo({ url: 'prescription/createrescription/', token: getToken().access, submission: { ...form, appointment: amtID } })
           
            if(response?.error?.status===400){
                setToastMsg({msg:response?.error?.data?.error,severity:'error'})
                setTimeout(()=>{
                    setToggle(prev => !prev)

                },2000)
                return
            }
            
            if(response.data.message) {
                setToastMsg({msg:response.data.message,severity:'success'})
                setTimeout(()=>{
                    setToggle(prev => !prev)

                },2000)
                    const res = refreshPrescriptionRecords()
                    AddPrescriptionRecord(res)

               
            }

        } catch (error) {
          
                setToastMsg({msg:'Something went wrong',severity:'error'})
                setTimeout(()=>{
                    setToggle(prev => !prev)

                },2000)
        }

    
    },[form])
    return (
        <>
            <StyledWrapper className="w-full max-w-6xl md:mt-2 md:mb-0 mt-10 mb-20  overflow-hidden rounded-xl p-6  shadow-lg shadow-regal-dark-blue md:p-10">
                
                <form className="form" onSubmit={handleSubmit}>
                    {
                        [
                            { label: 'Add Prescription', name: 'medication_details' },
                           

                        ].map(({ label, name }) => (

                            <div className="w-full rounded-lg shadow" key={label}>
                                <label htmlFor={name} className="block text-lg font-medium text-[#1db91d] mb-1">{label}</label>
                                <textarea
                                    id={name}
                                    name={name}
                                    rows="10"
                                    placeholder="Write your message..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#437a43] focus:border-transparent resize-none"
                                    value={form[name]}
                                    onChange={handleChange}
                                ></textarea>
                                {error[name] && <span className='error_msg'>This Field Is Required!</span>}
                            </div>
                        ))

                    }


                    <button type='submit' className='submit  '>

                        {
                            isLoading ?
                                <div className="loader-wrapper">
                                    <Loader size="sm" />
                                </div>
                                :
                                'ADD'
                        }
                    </button>
                </form>
                <Alert severity={toastMsg.severity} style={{ whiteSpace: 'pre-line' }}  >{toastMsg.msg}</Alert>

            </StyledWrapper>

        </>
    )
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

export default AddPrescriptionInfoDoctor;