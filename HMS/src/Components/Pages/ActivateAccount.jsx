import { useSelector } from 'react-redux'
import IsDarkMode from "../../utility/DarkDay";
import {useNavigate,useParams} from 'react-router-dom'
import {useActivateAccountQuery} from "../../services/userAuthApi"
import Loader from '../Loader';

const ActivateAccount = () => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()
    const {uid,token} = useParams()
    const { data, isLoading }=useActivateAccountQuery({uid,token})
  
    
       if (isLoading) {
        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <div className='h-[94vh] flex flex-row items-center justify-center'>
                    <Loader />
                </div>
            </div>
        )
    }
      

    return (
        <>
            <div className={`min-h-screen w-full overflow-hidden ${IsDarkMode(isDark)} `}>
                <div className='h-[94vh] flex flex-col items-center justify-center'>
                    <h1 className='text-2xl m-3'>{data.message}</h1>
                     <button className="group cursor-pointer rounded-sm outline-none  py-1 px-2 bg-[#1db91d] hover:text-[#1db91d] hover:bg-white border mb-3 sm:mb-0" onClick={()=>navigate("/login")} >
                        Click Here
              </button>
                </div>

            </div>
        </>
    );
};



export default ActivateAccount;
