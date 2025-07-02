import { useEffect } from "react";
import { convert24To12hour } from '../../../utility/timeFormat'
import formatDate from '../../../utility/formatDate';
import { useDispatch } from "react-redux";
import { setPatientrID } from "../../../features/storePatientID/storePatientIDSlice";
import { useSelector } from 'react-redux'
import { useUpdateRecordMutation } from '../../../services/userAuthApi'
import { getToken } from '../../../services/LocalStorage'
import { useNavigate } from 'react-router-dom'

const PatientInfoCard = ({ patient }) => {
    const dispatch = useDispatch()
    const isDark = useSelector(state => state.dark.isDark);
    const navigate = useNavigate()
    let {
        id = patient?.data?.patient_id,
        name = patient?.data?.patient,
        date = formatDate(patient?.data?.appointment_date),
        time = convert24To12hour(patient?.data?.appointment_time),
        patient_status = patient?.data?.status,
        appointment_id = patient?.data?.booking_id,
    } = patient || {};

    const [updateAmptID] = useUpdateRecordMutation()
    useEffect(() => {
        dispatch(setPatientrID(id))

    }, [])

    const handleStatus = async (e) => {
        e.preventDefault()
        if (patient_status !== 'Completed') {

            try {
                const response = await updateAmptID({ url: `appointment/showdoctorappoinment/${appointment_id}/`, token: getToken().access, body: { 'status': 'Completed' } })
                navigate("/doctorpatientlist", {
                    state: { shouldRefetch: true }
                }
                )

            }
            catch (error) {

            }
        }


    }

    return (


        <div className={`max-w-4xl mx-auto mt-20 ${isDark ? 'bg-gray-800  hover:shadow-gray-600 text-[#e3e3ec]' : 'bg-[#e3e3ec] text-black hover:shadow-[#a7a5a5]'} rounded-2xl pb-4`}>
            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
                <h2 className="text-2xl font-semibold text-[#1db91d]">Patient Info</h2>
            </div>

            {/* Main content in two-column grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient ID</p>
                    <p className="text-base font-semibold">{id}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointment ID</p>
                    <p className="text-base font-semibold">{appointment_id}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Name</p>
                    <p className="text-base font-semibold">{name}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-base font-semibold">{date}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-base font-semibold">{time}</p>
                </div>
            </div>

            {/* Status Row */}
            <div className="px-6 py-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <div className="flex justify-between flex-wrap items-center">

                    <span
                        className={`inline-block px-4 py-1 text-sm rounded-full font-medium ${patient_status === "Scheduled"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                    >
                        {patient_status}
                    </span>

                    <button className={`${patient_status === 'Completed' ? 'cursor-not-allowed bg-green-900' : 'cursor-pointer bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-yellow-100 hover:text-black'} text-sm rounded-sm outline-none font-medium py-1 px-1  border sm:mb-0`}
                        onClick={handleStatus} disabled={patient_status === 'Completed'}
                    >Click to Complete</button>

                </div>
            </div>
        </div>

    );
};

export default PatientInfoCard;
