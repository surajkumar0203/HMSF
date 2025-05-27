import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import IsDarkMode from '../../utility/DarkDay';
import deleteWindow from '../../Images/delete.png'
import styled from 'styled-components';
const AppointmentBook = ({ setIsAppointmentBook }) => {
    const isDark = useSelector(state => state.dark.isDark)
    const navigate = useNavigate()
    const closeWindow = () => {
        setIsAppointmentBook(false)
    }

    return (
        <div className={`min-h-screen overflow-hidden  ${IsDarkMode(isDark)} px-4`}>
            <div className=' mt-24 flex justify-end '>

                <button onClick={closeWindow} className=' cursor-pointer  '>

                    <img className='w-9 hover:rotate-90 duration-300' title='close window' src={deleteWindow} alt={deleteWindow} />
                </button>
            </div>
            {/*  */}
            <div className='flex items-center justify-center'>
                <StyledWrapper className="w-full max-w-md  mt-32  rounded-xl p-6 shadow-lg shadow-regal-dark-blue md:p-10  ">
                    <form className="form">
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#58bc82]">Book Your Appoinmnet</h2>

                        <label htmlFor="email" className="label">
                            Email/UserID
                        </label>
                        <input type="text" name="email" id="email" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} placeholder="Email/UserID"

                        />

                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input type="password" name="password" id="password" className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} `} placeholder="Password"

                        />





                        <button type='submit' className='submit' >
                            {

                                'Login'
                            }
                        </button>


                    </form>
                </StyledWrapper>
            </div>
        </div>
    );
};
const StyledWrapper = styled.div`
  .form {
    --bg-light: #efefef;
    --bg-dark: #444;
    --clr: #58bc82;
    --clr-alpha: #9c9c9c60;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  
  }
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
  .form input[type="text"],
  .form input[type="password"] {
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
   
    border: none;
    outline: 2px solid var(--bg-dark);
  }

 .error{
    outline: 2px solid red !important;
}

    .error_msg{
        color: red;
        font-size: 0.8rem;
    }

  .label {
    font-weight: 600;
    color: var(--clr);
  }

  .form .submit {
    padding: 0.75rem;
    width: 100%;
    border-radius: 999px;
    background-color: var(--bg-dark);
    color: var(--bg-light);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

 display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem; 
    
  }

  .form .submit:hover {
    background-color: var(--clr);
    color: var(--bg-dark);
  }
`;

export default AppointmentBook;
