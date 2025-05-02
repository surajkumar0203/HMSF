import React, { useState,useEffect } from 'react';
import Patient from './Patient';
import Staff from './Staff';

const Register = () => {
    let role = sessionStorage.getItem('tab');
    const [tab, setTab] = useState("");
  
    useEffect(()=>{
        if (!role){
            sessionStorage.setItem('tab', 'Patient')
            setTab("Patient")
        }else{
            setTab(role)
        }
    },[])

   
    return (
        <div className="w-full max-w-4xl mx-auto mt-10 p-4 ">
        <>
            <div className="flex justify-center  mt-10">
                <button
                    onClick={() => {
                        sessionStorage.setItem('tab', 'Patient')
                        setTab("Patient")
                        
                    }}
                    className={`px-6 py-2 mx-2 text-lg font-medium rounded-full transition-all duration-300 cursor-pointer
                        ${role === 'Patient'
                            ? 'bg-[#58bc82]  shadow-lg '
                            : ' hover:bg-gray-800'}`}
                >
                    Patient
                </button>
                <button
                    onClick={() => {
                        sessionStorage.setItem('tab', 'Staff')
                        setTab("Staff")
                    }}
                    className={`px-6 py-2 mx-2 text-lg font-medium rounded-full transition-all duration-300 cursor-pointer
                        ${role === 'Staff'
                            ? 'bg-[#58bc82]  shadow-lg '
                            : ' hover:bg-gray-800'}`}
                >
                    Staff
                </button>
            </div>

       
            {tab === 'Patient' ? <Patient /> : <Staff />}
       
            </>
         </div>
    );
};

export default Register;
