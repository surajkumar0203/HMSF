import { useSelector } from 'react-redux'
import AddPrescriptionInfoDoctor from './AddPrescriptionInfoDoctor';
import {
    Collapse,
    Ripple,
    initTWE,
} from "tw-elements";
import { useLazyGetqueryQuery, useDeleteRecordMutation } from '../../../services/userAuthApi'
import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2'
initTWE({ Collapse, Ripple });
import { getToken } from '../../../services/LocalStorage'



const PatientPrescription = ({ prescriptionRecord,amtID ,filterStatus}) => {

    const isDark = useSelector(state => state.dark.isDark);
    const [nextUrl, setNextUrl] = useState(null);
    const [prescriptionRecords, setprescriptionRecords] = useState([])
    const prescriptionDetailScroll = useRef(null);
    const [backendMessage, setBackendMessage] = useState('')

    const [fetchMoreQuery, { isFetching }] = useLazyGetqueryQuery();
    const [expandedId, setExpandedId] = useState(null);

    const [toggle, setToggle] = useState(false)

    const [deleteRecord] = useDeleteRecordMutation();
    const patientID = useSelector(state => state.patientID.id)
    
    // load more data
    const loadMoreMedicalRecords = async () => {

        if (!nextUrl || isFetching) return

        try {

            const res = await fetchMoreQuery({ url: `${nextUrl}`, token: getToken().access })

            setprescriptionRecords(prev => {
                const id = new Set(prev.map(item => item.id));
                const filter = res.data.data.results.filter(item => {
                    return !id.has(item.id)

                })

                return [...prev, ...filter]

            })

            setNextUrl(res.data.data.next)


        } catch (error) {

        }
    }

    const handleScroll = (node) => {
        // scroll height(Height of the div container or which contain appoinmentDetailScroll)
        const scrollHeight = node.scrollHeight;
        // viewable Hight(jo height screen par dikh raha hai.)
        const viewHeight = node.clientHeight
        // scrollTop return number of pixel that the document has been scrolled vertically
        const scrollTop = node.scrollTop

        if ((viewHeight + scrollTop + 1) >= scrollHeight) {

            loadMoreMedicalRecords()
        }

    };

    // again Fetch
    const refreshPrescriptionRecords = async () => {
        try {
            const response = await fetchMoreQuery({
                url: `prescription/showprescription/${patientID}`,
                token: getToken().access
            });

            AddPrescriptionRecord(response);
        } catch (error) {
           
        }
    };

    // AddMore Record
    const AddPrescriptionRecord = (patientRecord) => {
        if (patientRecord?.data?.results) {
            setBackendMessage('')
            setprescriptionRecords([...patientRecord.data.results])
            setNextUrl(patientRecord.data.next)

        } else {

            setBackendMessage(patientRecord?.message)

        }

    }

    useEffect(() => {
        AddPrescriptionRecord(prescriptionRecord)
    }, [prescriptionRecord])


    useEffect(() => {
        const node = prescriptionDetailScroll.current
        if (!node) return
        const scrollHandler = () => handleScroll(node);
        node.addEventListener('scroll', scrollHandler);
        return () => {
            node.removeEventListener('scroll', scrollHandler)
        }
    }, [nextUrl, prescriptionDetailScroll.current])

    // Delete Medical Info using SweetAlert
    const deleteSingleMedicalRecord = (ids) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1db91d",
            theme: isDark ? `dark` : 'light',
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteRecord({ url: `prescription/deleterescription/${ids}/`, token: getToken().access })
                if (response?.error?.status === 404) {
                    Swal.fire({
                        title: "Deleted!",
                        text: `${response?.error?.data?.message}`,
                        icon: "error"
                    });
                    return
                }
                const res = await refreshPrescriptionRecords()
                AddPrescriptionRecord(res)
                Swal.fire({
                    title: "Deleted!",
                    text: `${response?.data?.message}`,
                    icon: "success",
                    theme: isDark ? `dark` : 'light',
                });


            }
        });
    }


    return (


        <div className={`max-w-4xl mx-auto px-6 mt-2 ${isDark ? 'bg-gray-800  hover:shadow-gray-600 text-[#e3e3ec]' : 'bg-[#e3e3ec] text-black hover:shadow-[#a7a5a5]'} rounded-2xl pb-4`}>
            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-700 flex justify-between py-4">
                <h2 className="text-2xl font-semibold text-[#1db91d]">Prescription Info</h2>

               <button className={`${filterStatus==='Completed'?'cursor-not-allowed bg-[#0f310f]':'cursor-pointer bg-[#1db91d] hover:text-[#1db91d] hover:bg-white'}  rounded-sm outline-none  py-1 px-7  border mb-3 sm:mb-0`} disabled={filterStatus==='Completed'} onClick={() => {
                   
                   if(filterStatus!=='Completed')
                       setToggle(!toggle)

         
                    }}>


                    <span className='font-bold text-2xl mr-1'>
                        {
                            !toggle ? '+' : '-'
                        }

                    </span>

                </button>
            </div>
            

            {
                !toggle ?
                    <>

                        <div className={`hidden  sm:grid grid-cols-5 gap-4 mb-2 ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-2 rounded-t mt-4`} >

                            <div>Doctor Name</div>
                            <div>Record_date</div>
                            <div>Record_time</div>
                            <div>Show more</div>
                            <div >
                                <span className='bg-red-400 text-red-800  rounded-2xl py-1 px-2 mr-1'>
                                    Delete
                                </span>
                            </div>

                        </div>

                        <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `} ref={prescriptionDetailScroll}>

                            {
                                !backendMessage ?
                                    prescriptionRecords.map((pr) => (
                                        <div key={pr.id} >
                                            <div

                                                className={`grid grid-cols-1 sm:grid-cols-5 gap-4 p-2 rounded shadow`}
                                            >
                                                <div><span className="sm:hidden font-bold">Doctor Name: </span>{pr.doctor}</div>
                                                <div><span className="sm:hidden font-bold">Record_date: </span>{pr.date}</div>
                                                <div><span className="sm:hidden font-bold">Record_time: </span>{pr.time}</div>

                                                <div><span className="sm:hidden font-bold">Showmore: </span><button className={`text-regal-blue underline underline-offset-2 cursor-pointer`} onClick={() => setExpandedId(expandedId === pr.id ? null : pr.id)}>Click here</button></div>

                                                {
                                                    filterStatus!=='Completed'?
                                                <div><span className="sm:hidden font-bold bg-red-400 text-red-800 rounded-2xl py-1 px-2 mr-1">Delete: </span><button className={`text-red-700 underline underline-offset-2 cursor-pointer`} onClick={() => deleteSingleMedicalRecord(pr.id)}>Delete</button></div>
                                               :<></>
                                            }



                                            </div>
                                       
                                            {/* Collapse Section */}
                                            {expandedId === pr.id && (


                                                <div className='grid grid-cols-1 px-2 gap-3 '>
                                                    <div className={`min-w-0 h-72 border rounded-2xl overflow-auto text-lg break-words`}>
                                                        <p className={`sticky ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} px-4 py-1  font-bold text-xl top-0`}>Add Prescription</p>
                                                        <div className='px-4'>
                                                            {pr.medication_details}
                                                        </div>
                                                    </div>
                                                </div>


                                            )

                                            }

                                        </div>
                                    ))

                                    :
                                    <p className='font-bold  text-center text-lg text-[#1db91d]'>{backendMessage}</p>
                            }

                        </div>
                    </>
                    :
                    <AddPrescriptionInfoDoctor setToggle={setToggle} AddPrescriptionRecord={AddPrescriptionRecord} refreshPrescriptionRecords={refreshPrescriptionRecords} amtID={amtID} />
            }
            </div>
      

    );
}

export default PatientPrescription;