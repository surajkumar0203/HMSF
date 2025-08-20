import { useGetqueryQuery,useDeleteRecordMutation } from "../../services/userAuthApi";
import { getToken } from "../../services/LocalStorage";
import deleteWindow from '../../Images/delete.png'
import Loader from '../Loader';
import { useState } from "react";
import Swal from 'sweetalert2'
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";
initTWE({ Collapse, Ripple });

import { useSelector } from 'react-redux'
const LeaveHistory = ({ setIsLeaveHistory }) => {
    const isDark = useSelector(state => state.dark.isDark);
    const { data: leaveHistory, isLoading } = useGetqueryQuery({ url: "staff/staffleave/", token: getToken().access })
    
    const [expandedId, setExpandedId] = useState(null);
    const [deleteRecord] = useDeleteRecordMutation();

    // Cancel unapproved leave
    const CancelLeave = (ids) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Click Yes to cancel the leave",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1db91d",
            theme: isDark ? `dark` : 'light',
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteRecord({ url: `staff/staffleave/${ids}/`, token: getToken().access })
                if (response?.error?.status === 404) {
                    Swal.fire({
                        title: "Invalid Id!",
                        text: `${response?.error?.data?.message}`,
                        icon: "error",
                        theme: isDark ? `dark` : 'light',
                    });
                    return
                }
              
                setIsLeaveHistory(false)
                Swal.fire({
                    title: "Canceled!",
                    text: `${response?.data?.message}`,
                    icon: "success",
                    theme: isDark ? `dark` : 'light',
                });


            }
        });
    }


    if (isLoading) {
        return (
            <div className='h-[60vh] flex flex-row items-center justify-center'>
                <Loader />
            </div>
        )
    }
    return (
        <>
            <div className='relative w-full '>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-center md:text-2xl  underline font-bold text-[#1db91d]">
                    List of leave history
                </h1>
                <button className='cursor-pointer absolute right-0' onClick={() => setIsLeaveHistory(false)}>
                    <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow} />
                </button>
            </div>
            <div className="mt-20">
                <div className={`hidden  sm:grid grid-cols-5 gap-4 mb-2  font-semibold p-2 rounded-t mt-4`} >

                    <div>From Date</div>
                    <div>End Date</div>
                    <div>Leave Approval</div>
                    <div>Show more</div>
                    <div >
                        <span className='bg-yellow-400 text-yellow-800  rounded-2xl py-1 px-2 mr-1'>
                            Cancel
                        </span>
                    </div>

                </div>
                <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `} >
                    {
                        leaveHistory.data.map((records) => (
                            <div key={records.id} >
                                <div className={`grid grid-cols-1 sm:grid-cols-5 gap-4 p-2 rounded shadow`}>
                                    <div><span className="sm:hidden font-bold">From Date: </span>{records.from_date}</div>
                                    <div><span className="sm:hidden font-bold">End Date: </span>{records.end_date}</div>
                                    <div><span className="sm:hidden font-bold">Leave Approval: </span>{records.leave_approval ? <span className="bg-green-400 text-green-800 p-1 rounded">approved</span> : <span className="bg-red-400 text-red-800 p-1 rounded">rejected</span>}</div>

                                    <div><span className="sm:hidden font-bold">Show more: </span><button className={`text-regal-blue underline underline-offset-2 cursor-pointer`} onClick={() => setExpandedId(expandedId === records.id ? null : records.id)}>Click here</button></div>
                                    {
                                    !records.leave_approval&&
                                    <div><span className="sm:hidden font-bold">Show more: </span><button className={`text-yellow-400 underline underline-offset-2 cursor-pointer`} onClick={()=>CancelLeave(records.id)}>Cancel leave</button></div>
                                    }
                                </div>
                                {/* Collapse Section */}
                                {expandedId === records.id && (
                                    <div className='grid grid-cols-1 px-2 gap-3 '>
                                        <div className={`min-w-0 h-72 border rounded-2xl overflow-auto text-lg break-words`}>
                                            <p className={`sticky px-4 py-1 border-b font-bold text-xl top-0`}>Reason For Leave</p>
                                            <div className='px-4 py-2'>
                                                {records.reason_leave}
                                            </div>
                                        </div>
                                    </div>


                                )

                                }
                            </div>
                        ))
                    }
                </div>

            </div>
        </>
    )
}


export default LeaveHistory;