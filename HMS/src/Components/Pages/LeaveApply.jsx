import {  useState, useCallback } from 'react';
import IsDarkMode from '../../utility/DarkDay';
import { useSelector } from 'react-redux'
import Alert from '@mui/material/Alert';
import styled from 'styled-components';
import Loader from "../Loader";
import { usePostQueryMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorage';
import LeaveHistory from './LeaveHistory';

const LeaveApply = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const [form, setForm] = useState({
        from_date: "",
        end_date: "",
        reason_leave: "",
    });
    const [LeaveApplyStaff,{isLoading}]=usePostQueryMutation()
    const [error, setError] = useState({});
    const [toastMsg, setToastMsg] = useState({ msg: '', severity: '' });
    const [isLeaveHistory,setIsLeaveHistory]=useState(false)


    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError({ ...error, [name]: false });
        setToastMsg({ msg: '', severity: '' });

    }, [form, error]);


    const handleSubmit = useCallback(async(e) => {
        e.preventDefault();
        const newError = {};
        Object.keys(form).forEach(key => {
            if (!form[key]) newError[key] = true;
        });
        setError(newError);
        if (Object.keys(newError).length > 0) return;

        try{
            const response=await LeaveApplyStaff({url:"staff/staffleave/",token:getToken().access,submission:form})
            if(response?.error?.status===404){
                setToastMsg({ msg: response?.error?.data?.error, severity: 'error' });
                return
             }
            setToastMsg({ msg: response?.data?.message, severity: 'success' });
                
        }catch(error){
            setToastMsg({ msg: "Something went wrong", severity: 'error' });
        }
    }, [form, error]);



    return (
        <>
            <div className={`min-h-screen flex  justify-center ${IsDarkMode(isDark)} px-4`}>

                <div className={`w-full max-w-2xl overflow-hidden  border p-2 md:p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} mt-25 mb-4 border-gray-600 rounded-2xl bg-gradient-to-r  shadow-lg `}>
                    {
                        isLeaveHistory?
                        <LeaveHistory setIsLeaveHistory={setIsLeaveHistory}/>
                        :
                         <StyledWrapper className='relative'>
                        <form onSubmit={handleSubmit} className="form">
                            <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Application For Leave</h2>
                            <div className="grid grid-cols-1 gap-4 mt-3 py-2   ">
                            
                                    <label htmlFor="from_date" className="label">From Date</label>
                                    <input
                                        type="date"
                                        name="from_date"
                                        id="from_date"
                                        className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `}
                                        autoComplete='on'
                                        min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
                                        max={new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split("T")[0]}
                                        value={form['from_date']}
                                        onChange={handleChange} />
                                    {error['from_date'] && <span className='error_msg'>This Field Is Required!</span>}
                          
                                {form['from_date'] &&
                                    <>
                                        <label htmlFor="end_date" className="label">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            id="end_date"
                                            className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `}
                                            autoComplete='on'

                                            min={form['from_date']}
                                            max={new Date(new Date(form['from_date']).setDate(new Date(form['from_date']).getDate() + 10)).toISOString().split("T")[0]}
                                            value={form['end_date']}
                                            onChange={handleChange} />
                                        {error['end_date'] && <span className='error_msg'>This Field Is Required!</span>}
                                    </>
                                }
                                <label htmlFor="reason_leave" className="label">Reason For Leave</label>
                                <textarea
                                    name="reason_leave"
                                    id="reason_leave"
                                    rows="10"
                                    className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `}
                                    value={form.reason_leave}
                                    onChange={handleChange} />
                                {error['reason_leave'] && <span className='error_msg'>This Field Is Required!</span>}
                            </div>

                            <button type='submit' className='submit '>
                                {
                                    isLoading ?
                                        <div className="loader-wrapper">
                                            <Loader size="sm" />
                                        </div>
                                        :
                                        'Apply'
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
                        </form>
                        
                            <div className='md:fixed bottom-4 left-1/2 md:transform md:-translate-x-1/2 text-center text-lg p-2'>
                                <span>Show Leave History</span><button className='underline cursor-pointer text-[#1db91d] ml-3' onClick={()=>setIsLeaveHistory(true)}>Click Here</button>
                            </div>
                        </StyledWrapper>
                  }
                </div>
                
            </div>
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
export default LeaveApply;