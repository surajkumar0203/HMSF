import IsDarkMode from "../../utility/DarkDay";
import { useSelector } from 'react-redux'


import contentLanding from "../contentLanding";
import Footer from "../Footer";
const AboutUS = () => {
    const isDark = useSelector(state => state.dark.isDark);
    const arr = contentLanding();
    return (
        <>
            <div className={`min-h-screen mt-20  w-full overflow-hidden ${IsDarkMode(isDark)} `}>
               


                <div className="max-w-4xl mx-auto mt-15  pb-4">

                    {
                        arr.map((item, index) => (
                            <section className={`px-6 mx-10 my-7 py-12 ${isDark ? 'bg-gray-800 text-white' : 'bg-[#e1dbe7] text-black'} rounded-br-[80px] rounded-tl-[80px] `} key={index}>
                                <div className={`max-w-6xl mx-auto flex  flex-col ${index%2?"md:flex-row":"md:flex-row-reverse"} items-center gap-8`}>
                                    <img src={item.pic} alt="Doctor writing notes" className="w-full md:w-1/2 rounded-lg shadow-md" />

                                    <div className="md:w-1/2">
                                        <h2 className="text-3xl font-bold mb-4 text-[#1db91d]">{item.des.h2}</h2>
                                        <p className="text-lg  mb-6">{item.des.p}</p>
                                        <ul className="list-disc pl-5 ">
                                            {...item.des.ul}
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        ))
                    }
                </div>
            </div>
            <Footer/>
        
        </>
    );
}

export default AboutUS;