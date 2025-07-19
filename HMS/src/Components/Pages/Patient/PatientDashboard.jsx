import calender from '../../../Images/calendar.png'
import medicalrecord from '../../../Images/medicalrecord.png'
import prescription from '../../../Images/prescription.png'
import { Link } from 'react-router-dom'

const PatientDashboard = ({isDark}) => {
    
    return (
        
            <div className="grid  grid-cols-1 sm:grid-cols-2 px-3 md:grid-cols-2  lg:grid-cols-4 gap-6">
                {
                    [
                        { src: calender, alt: "appointment", title: 'Appointment Book', href: '/appointment' },
                        { src: medicalrecord, alt: "medicalrecord", title: 'MedicalRecord', href: '/medicalrecord' },
                        { src: prescription, alt: "prescription", title: 'Prescription', href: '/prescription' },

                    ].map(({ src, alt, title, href }, key) => (
                        <Link key={key} to={href} className={`rounded-xl p-6 flex  flex-col items-center hover:shadow-lg transition duration-300 ${isDark ? 'bg-gray-800  hover:shadow-gray-600 text-[#e3e3ec]' : 'bg-[#e3e3ec] text-black hover:shadow-[#a7a5a5]'}`}>
                            <img src={src} alt={alt} className={`mb-4 h-40 w-40   ${isDark ? 'invert-75' : ''}`} />
                            <h2 className="text-lg font-semibold ">{title}</h2>
                        </Link>
                    ))
                }
            </div>
        
    )
}

export default PatientDashboard;