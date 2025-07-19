import pic from '../Images/pic.jpg'
import pic2 from '../Images/pic2.jpg'
import pic3 from '../Images/pic3.jpg'


const contentLanding = () =>{
    const arr=[
         {
                    pic: pic,
                    des: {
                        h2: "Your Health, Our Priority",
                        p: " At MediCare Hospital, our experienced medical professionals are dedicated to delivering personalized care using modern technology.From diagnosis to treatment, we ensure that every patient receives compassionate and efficient healthcare.",
                        ul: [
                            <li>24/7 emergency support</li>,
                            <li>Expert doctors & specialists</li>,
                            <li>Easy online appointment booking</li>,
                            <li>Secure patient data handling</li>
                        ]
        
        
        
                    }
                },
                {
                    pic: pic2,
                    des: {
                        h2: "Experienced Team of Doctors",
                        p: "Our team of highly trained and collaborative doctors work together to deliver accurate diagnoses and effective treatments.With cutting-edge tools and patient-first care, we ensure excellence at every stage of your medical journey.",
                        ul: [
                            <li>Multidisciplinary approach to treatment</li>,
                            <li>Advanced diagnostic technology</li>,
                            <li>Continuous training and research</li>,
                            <li>Friendly and professional environment</li>
                        ]
                    }
                },
                {
                    pic: pic3,
                    des: {
                        h2: "Modern & Comfortable Facilities",
                        p: "MediCare Hospital is equipped with state-of-the-art infrastructure to ensure the comfort and safety of our patients.From well-maintained rooms to advanced medical monitoring systems, we prioritize healing in a peaceful environment.",
                        ul: [
                            <li>Clean & spacious patient rooms</li>,
                            <li>Real-time vitals monitoring</li>,
                            <li>Wheelchair and emergency support</li>,
                            <li>Focus on hygiene and comfort</li>
                        ]
                    }
                },
               
               
    ]

    return arr;
}

export default contentLanding;