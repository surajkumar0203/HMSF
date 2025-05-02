import React,{useEffect} from 'react';

import { useSelector } from 'react-redux'



import {useNavigate,useParams} from 'react-router-dom'
import {useActivateAccountQuery} from "../../services/userAuthApi"

const ActivateAccount = () => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()
    const {uid,token} = useParams()
    const { data, isLoading }=useActivateAccountQuery({uid,token})
  
 
    useEffect(()=>{
        console.log(data)
        navigate("/login")
    },[])
    
       
      

    return (
        <>

        </>
    );
};



export default ActivateAccount;
