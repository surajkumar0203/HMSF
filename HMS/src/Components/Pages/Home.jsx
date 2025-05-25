import IsDarkMode from "../../utility/DarkDay";
import { useSelector } from 'react-redux'

const Home = () =>{
    const isDark = useSelector(state => state.dark.isDark);
    return(
        <>
        <div className={`min-h-screen w-full  ${IsDarkMode(isDark)} `}>

    <h1>Home</h1>
    <p>Welcome to the home page!</p>
        </div>
           
        </>
    )
}

export default Home