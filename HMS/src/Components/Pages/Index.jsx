import IsDarkMode from "../../utility/DarkDay";
import { useSelector } from 'react-redux'

const Index = () =>{
    const isDark = useSelector(state => state.dark.isDark);
    return(
        <>
        <div className={`min-h-screen w-full overflow-hidden ${IsDarkMode(isDark)} `}>
            <div className=' mt-24  flex justify-end '>

                 mmm
                </div>
            <h1>Home</h1>
            <p>Welcome to the home page!</p>
        </div>
           
        </>
    )
}

export default Index