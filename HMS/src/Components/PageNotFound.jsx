import IsDarkMode from "../utility/DarkDay";
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom";

const PageNotFound=()=>{
const isDark = useSelector(state => state.dark.isDark);
    return(

     <div className={`min-h-screen w-full flex flex-col items-center justify-center ${IsDarkMode(isDark)}`}>
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold  mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center px-4">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Go to Home
      </Link>
    </div>
    )
}


export default PageNotFound;