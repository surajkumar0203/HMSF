import { useSelector } from 'react-redux'
import IsDarkMode from '../../../utility/DarkDay';
import { useGetqueryQuery, useLazyGetqueryQuery } from '../../../services/userAuthApi'
import { getToken } from '../../../services/LocalStorage'
import Loader from '../../Loader';
import { convert24To12hour } from '../../../utility/timeFormat'
import { useState, useEffect, useRef } from 'react';
import deBoune from '../../../utility/deBouncing';
import MedicalRecordDetails from './MedicalRecordDetails';
import formatDate from '../../../utility/formatDate';

const MedicalRecord = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const [searchValue,setSearchValue]=useState("")
    const { data: medicalrecords, isLoading, isSuccess } = useGetqueryQuery({ url: `medicalrecord/showmedicalrecord?search=${searchValue}`, token: getToken().access })
   
    const [fetchMoreQuery, { isFetching }] = useLazyGetqueryQuery();
    const [nextUrl, setNextUrl] = useState(null);
    const [medicalrecord, setMedicalRecords] = useState([])
    const medicalRecordDetailScroll = useRef(null);
    const [backendMessage,setBackendMessage]=useState('')
    const [isMedicalDetails,setIsMedicalDetails]=useState(null)
    
    // load more data
    const loadMoreMedicalRecords = async () => {

        if (!nextUrl || isFetching) return

        try {
            const res = await fetchMoreQuery({ url: `${nextUrl}`, token: getToken().access })

            setMedicalRecords(prev => {
                const id = new Set(prev.map(item => item.id));
                const filter = res.data.data.results.filter(item => {
                    return !id.has(item.id)

                })
                if(filter.length===0){
                    return prev
                }
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
        const node = medicalRecordDetailScroll.current

        if (!node) return
        const scrollHandler = () => handleScroll(node);
        node.addEventListener('scroll', scrollHandler);


        return () => {

            node.removeEventListener('scroll', scrollHandler)

        }
    }, [nextUrl, medicalRecordDetailScroll.current])

    useEffect(() => {

    if (isSuccess && medicalrecords?.data?.results) {
      setBackendMessage('')
      setMedicalRecords([...medicalrecords.data.results])
      setNextUrl(medicalrecords.data.next)

    }else{
     
      setBackendMessage(medicalrecords?.message)
   
    }
    
  }, [isSuccess, medicalrecords])
 
  // search
  const inputHandler = async (e) =>{

    const value=e.target.value
    setSearchValue(value)
    
   
     
      if(medicalrecords?.data?.results){
        setBackendMessage("")
        setMedicalRecords([...medicalrecords?.data?.results])
     }
      else{
      
        // setAppoinmentList(res?.data?.searchNotFound)
       
        setBackendMessage(medicalrecords?.message)
      }
      
    }

    //  show details of MedicalRecords
    if(isMedicalDetails){
        return (
            <MedicalRecordDetails medicalRecords={isMedicalDetails} setIsMedicalDetails={setIsMedicalDetails} />
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
    if (medicalrecords.dataNotFound?.length === 0) {
        // when no appoinment available
        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <div className='h-[94vh] flex flex-col items-center justify-center'>
                    <p className='font-bold text-2xl mt-3 text-[#1db91d]'>{backendMessage}</p>
                </div>
            </div>
        )
    }
  
    return (
        <>
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>
                <div className={`max-w-4xl mx-auto mt-20  pb-4`}>
                    {/* Sticky Search Bar */}

                    <div className="flex flex-col sm:flex-row gap-4 items-center">

                        <div className="flex w-full sm:flex-1 border border-gray-300  rounded overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search by patient or doctor"
                                className={`w-full p-2 ${IsDarkMode(isDark)} focus:outline-none `}
                            onInput={deBoune(inputHandler, 500)}
                            />
                            <button className="bg-blue-500 p-2  text-white cursor-pointer" >
                                Search
                            </button>
                        </div>


                    </div>

                    {/* Table Header */}
                    <div className={`hidden sm:grid grid-cols-5 gap-4 mb-2 ${isDark ? 'bg-regal-dark-blue text-white' : 'bg-regal-blue text-black'} font-semibold p-2 rounded-t mt-4`} >

                        <div>Patient Name</div>
                        <div>Doctor Name</div>
                        <div>Record_date</div>
                        <div>Record_time</div>
                        <div>Show more</div>

                    </div>

                    <div className={`flex flex-col gap-2 max-h-[70vh] overflow-y-auto `} ref={medicalRecordDetailScroll}>

                        {


                            !backendMessage?

                            medicalrecord.map((mr) => (
                                <div
                                    key={mr.id}
                                    className={`grid grid-cols-1 sm:grid-cols-5 gap-4 p-2 rounded shadow ${isDark ? 'bg-gray-800 text-white' : 'bg-[#e3e3ec] text-black'}`}
                                >
                                    <div><span className="sm:hidden font-bold">Patient Name: </span>{mr.patient}</div>
                                    <div><span className="sm:hidden font-bold">Doctor Name: </span>{mr.doctor}</div>
                                    <div><span className="sm:hidden font-bold">Record_date: </span>{formatDate(mr.date)}</div>
                                    <div><span className="sm:hidden font-bold">Record_time: </span>{convert24To12hour(mr.time)}</div>
                                  
                                    <div><span className="sm:hidden font-bold">Showmore: </span><button className={`text-regal-blue underline underline-offset-2 cursor-pointer` } onClick={()=>setIsMedicalDetails(mr)}>Click here</button></div>
                                    
                                </div>
                            ))

                            :
                            <p className='font-bold  text-center text-lg text-[#1db91d]'>{backendMessage}</p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default MedicalRecord;