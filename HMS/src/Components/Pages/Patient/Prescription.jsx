import { useSelector } from 'react-redux'
import IsDarkMode from '../../../utility/DarkDay';
import formatDate from '../../../utility/formatDate';
import { useState, useEffect, useRef } from 'react';
import { convert24To12hour } from '../../../utility/timeFormat'
import { getToken } from '../../../services/LocalStorage'
import Loader from '../../Loader';
import { useGetqueryQuery,useLazyGetqueryQuery } from '../../../services/userAuthApi'
import PrescriptionRecordDetails from './PrescriptionRecordDetails';
const Prescription = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const [backendMessage,setBackendMessage]=useState('');
    const { data: prescriptionrecords, isLoading, isSuccess } = useGetqueryQuery({ url: `prescription/showprescription`, token: getToken().access })
    const [fetchMoreQuery, { isFetching }] = useLazyGetqueryQuery();
    const [nextUrl, setNextUrl] = useState(null);
    const prescriptionDetailScroll = useRef(null);
    const [isPrescriptionDetails,setIsPrescriptionDetails]=useState(null)
    const [prescriptionRecord, setPrescriptionRecords] = useState([])

   
    // load more data
    const loadMoreMedicalRecords = async () => {

        if (!nextUrl || isFetching) return

        try {
            const res = await fetchMoreQuery({ url: `${nextUrl}`, token: getToken().access })

            setPrescriptionRecords(prev => {
                const id = new Set(prev.map(item => item.id));
                const filter = res.data.data.results.filter(item => {
                    return !id.has(item.id)
                })
                if(filter.length===0)return prev
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
    useEffect(() => {
        const node = prescriptionDetailScroll.current

        if (!node) return
        const scrollHandler = () => handleScroll(node);
        node.addEventListener('scroll', scrollHandler);


        return () => {

            node.removeEventListener('scroll', scrollHandler)

        }
    }, [nextUrl, prescriptionDetailScroll.current])

     useEffect(() => {
    
        if (isSuccess && prescriptionrecords?.data?.results) {
          setBackendMessage('')
          setPrescriptionRecords([...prescriptionrecords.data.results])
          setNextUrl(prescriptionrecords.data.next)
    
        }else{
         
          setBackendMessage(prescriptionrecords?.message)
       
        }
        
      }, [isSuccess, prescriptionrecords])
 //  show details of MedicalRecords
    if(isPrescriptionDetails){
        return (
            <PrescriptionRecordDetails isPrescriptionDetails={isPrescriptionDetails} setIsPrescriptionDetails={setIsPrescriptionDetails} />
        )
    }
    if (isLoading) {
        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <div className='h-[94vh] flex flex-row items-center justify-center'>
                    <Loader />
                </div>
            </div>
        )
    }
if (prescriptionrecords.dataNotFound?.length === 0) {
        // when no appoinment available

        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <div className='h-[94vh] flex flex-col items-center justify-center'>
                    <p className='font-bold text-2xl mt-3 text-[#1db91d]'>{backendMessage}</p>
                </div>
            </div>
        )
    }
    return(
        <>
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>
                <div className={`max-w-4xl mx-auto mt-20  pb-4`}>

                    <div className={`hidden sm:grid grid-cols-6 gap-4 mb-2 ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-2 rounded-t mt-4`} >

                        <div>Appointment ID</div>
                        <div>Patient Name</div>
                        <div>Doctor Name</div>
                        <div>Record_date</div>
                        <div>Record_time</div>
                        <div>Show more</div>

                    </div>
                    <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `} ref={prescriptionDetailScroll} >

                        {
                            prescriptionRecord.map((pr) => (
                                <div
                                    key={pr.id}
                                    className={`grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 rounded shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-[#e3e3ec] text-black'}`}
                                >
                                    <div><span className="sm:hidden font-bold">Appointment ID: </span>{pr.appointment}</div>
                                    <div><span className="sm:hidden font-bold">Patient Name: </span>{pr.patient}</div>
                                    <div><span className="sm:hidden font-bold">Doctor Name: </span>{pr.doctor}</div>
                                    <div><span className="sm:hidden font-bold">Record_date: </span>{formatDate(pr.date)}</div>
                                    <div><span className="sm:hidden font-bold">Record_time: </span>{convert24To12hour(pr.time)}</div>
                                  
                                    <div><span className="sm:hidden font-bold">Showmore: </span><button className={`text-regal-blue underline underline-offset-2 cursor-pointer` } onClick={()=>setIsPrescriptionDetails(pr)}>Click here</button></div>
                                    
                                </div>
                            ))

                           
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default Prescription;