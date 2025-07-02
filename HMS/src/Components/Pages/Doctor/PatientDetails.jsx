import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import IsDarkMode from "../../../utility/DarkDay";
import PatientInfoCard from "./PatientInfoCard";
import { useGetqueryQuery } from '../../../services/userAuthApi';
import { getToken } from '../../../services/LocalStorage'
import Loader from '../../Loader';
import PatientMedicalCard from "./PatientMedicalCard";
import PatientPrescription from "./PatientPrescription";

import { useLocation } from "react-router-dom";


const PatientDetails = () => {
    const param = useParams();
    const isDark = useSelector(state => state.dark.isDark);
    const location = useLocation()
  
    const filterStatus=location?.state?.filterStatus || 'Scheduled'
    


    
    const { data: patient, isLoading, isSuccess } = useGetqueryQuery({ url: `/appointment/showdoctorappoinment/${param.amtID}/?filter=${filterStatus}`, token: getToken().access })

    const patientID = patient?.data?.patient_id

    const { data: patientMedicalRecord, isLoading: medicalLoading } = useGetqueryQuery({ url: `/medicalrecord/showmedicalrecord/${patientID}`, token: getToken().access }, { skip: !isSuccess || !patientID })

    const { data: prescriptionRecord, isLoading: prescriptionLoading } = useGetqueryQuery({ url: `prescription/showprescription/${patientID}`, token: getToken().access }, { skip: !isSuccess || !patientID })


    if (isLoading || medicalLoading || prescriptionLoading) {
        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>
                <div className='h-[94vh] flex flex-row items-center justify-center'>
                    <Loader />
                </div>
            </div>
        )
    }

    if (patient?.dataNotFound?.length === 0) {
        // when not available

        return (
            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)}`}>

                <div className='h-[50vh] flex flex-col  items-center justify-center'>

                    <p className='font-bold text-2xl mt-3 text-[#1db91d]'>{patient.message}</p>

                </div>
            </div>
        )
    }



    return (
        <>


            <div className={`min-h-screen  py-6 px-4 ${IsDarkMode(isDark)} `}>
                


                    
                    <PatientInfoCard patient={patient}  />
                    <PatientMedicalCard patientMedicalRecords={patientMedicalRecord} filterStatus={filterStatus} />
                    <PatientPrescription prescriptionRecord={prescriptionRecord} amtID={param.amtID} filterStatus={filterStatus}/>
             

            </div>
        </>

    )
}

export default PatientDetails;