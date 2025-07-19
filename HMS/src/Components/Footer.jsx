import card from '../Images/cards.png'
import { useSelector } from 'react-redux'

const Footer = () => {
    const isDark = useSelector(state => state.dark.isDark);
    return (
        <>
            <footer className={`${isDark?"bg-gray-800 text-white":"bg-[#e1dbe7] text-black"}  `}>
                <div className='pt-10 pb-5 px-5'>
                    <div className='flex flex-col'>
                        <span className={`border-2  font-mono p-2 w-36 font-bold`}><span className={`mx-1 p-1 my-5 ${!isDark?"bg-gray-800 text-white":"bg-white text-black"}`}>Medi</span><span>Care</span></span>
                        <p className='my-5 font-thin'>
                            Welcome to MediCare
                        </p>
                        <img src={card} alt={card} className='w-48 my-5' />
                    </div>
                    <div className='flex gap-x-96 gap-y-4 flex-wrap  font-thin'>
                        <div className='flex flex-col '>
                            <h4 className='mb-5 font-medium'>HOSPITAL</h4>
                            <p  className='mb-5'>24/7 emergency support</p>
                            <p  className='mb-5'>Laptop Store</p>
                            <p  className='mb-5'>Accessories</p>
                            <p  className='mb-5'>Sales & Discount</p>
                        </div>

                        <div className='flex flex-col'>
                            <h4 className='mb-5 font-medium'>EXPERIENCE</h4>
                            <p className='mb-5'>Multidisciplinary approach to treatment</p>
                            <p className='mb-5'>Advanced diagnostic technology</p>
                            <p className='mb-5'>Continuous training and research</p>
                            <p className='mb-5'>Friendly and professional environment</p>
                        </div>
                    </div>

                    <div className='font-thin'>
                        <h4 className='font-medium'>NEWSLETTER</h4>
                        <p className='mb-1'>
                            Be the first to know about new
                        </p>
                        <p className='mt-1'>
                            arrivals, sales & promos!
                        </p>
                    </div>
                </div>
                
                <div className='border-t-2 border-gray-500'>
                    <div className='py-2 text-center text-xl font-thin text-gray-500'>
                        <p>Design and Code by Suraj Kumar</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;