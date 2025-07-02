import IsDarkMode from '../../../utility/DarkDay';
import deleteWindow from '../../../Images/delete.png'
import { useSelector } from 'react-redux';

import formatDate from '../../../utility/formatDate';
import { convert24To12hour } from '../../../utility/timeFormat'

const PrescriptionRecordDetails = ({isPrescriptionDetails,setIsPrescriptionDetails}) => {
    const isDark = useSelector(state => state.dark.isDark)
    const closeWindow = () => {
        setIsPrescriptionDetails(null);
    }
   
    return (
        <>
            <div className={`min-h-screen overflow-hidden  ${IsDarkMode(isDark)} px-4`}>
                <div className=' mt-24 flex justify-end '>
                    <button onClick={closeWindow} className=' cursor-pointer  '>
                        <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow} />
                    </button>
                </div>
                
                <div className="w-full px-4 -mt-15 max-w-4xl mx-auto">
                    <p className='text-regal-blue text-3xl font-bold text-center py-5 '>Prescription Records</p>
                    <div className={`block space-y-4 mb-6 `}>
                        {[
                            ['Patient Name', isPrescriptionDetails.patient],
                            ['Doctor Name', isPrescriptionDetails.doctor],
                            ['Date', isPrescriptionDetails.date],
                            ['Time', isPrescriptionDetails.time],
                            ['medication_details', isPrescriptionDetails.medication_details],
                           
                        ].map(([label, value], index) => (
                            <div key={index} className={`rounded-xl p-4  shadow-sm ${isDark ? 'bg-gray-800 text-white' : 'bg-[#e3e3ec] text-black'}`}>
                                <div className={`text-lg font-medium mb-1 text-regal-blue`}>{label}</div>
                                {
                                    label === 'Date'?
                                        <div className={`text-lg`}>
                                            {formatDate(value)}
                                        </div>
                                        :
                                    label === 'Time'?
                                        <div className={`text-lg`}>
                                            {convert24To12hour(value)}
                                        </div>
                                        :
                                    <div className={`text-lg  ${label === 'medication_details'? 'h-72 overflow-auto  pr-6 break-words' : ''}`}>
                                        {value}
                                    </div>
                                }

                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </>
    )
}


export default PrescriptionRecordDetails;