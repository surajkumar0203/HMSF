import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import IsDarkMode from '../../utility/DarkDay';
import deleteWindow from '../../Images/delete.png'

const AppoinmentBook = ({setIsAppoinmentBook}) => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()
    const closeWindow=()=>{
        setIsAppoinmentBook(false)
    }
    
    return (
        <div className={`min-h-screen overflow-hidden ${IsDarkMode(isDark)} px-4`}>
            <div className=' mt-24 flex justify-end'>

            <button onClick={closeWindow} className=' cursor-pointer  '>
            
            <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow}/>
            </button>
            </div>
            <div>

                Jee
            </div>
        </div>
    );
};


export default AppoinmentBook;
