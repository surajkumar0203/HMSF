import {useEffect} from 'react';
import styled from 'styled-components';
import { storeTheme } from "../services/LocalStorage"
import { useSelector, useDispatch } from 'react-redux'
import { darkModeButton } from '../features/dark/darkSlice';

const DarkModeToggle = () => {
  const isDark = useSelector(state => state.dark.isDark)
  const dispatch = useDispatch()
 
  useEffect(()=>{
   
    if(isDark){
     
      storeTheme('theme', 'dark');
    }else{
    
      storeTheme('theme', 'light');
    }
  },[isDark])

  return (
    <StyledWrapper>
      <label className="switch">
        <input type="checkbox" 
        checked={isDark}
        onChange={()=>dispatch(darkModeButton())}/>
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    --background: #28096b;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background);
    transition: .5s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.4em;
    width: 1.4em;
    border-radius: 50%;
    left: 10%;
    bottom: 15%;
    box-shadow: inset 8px -4px 0px 0px #fff000;
    background: var(--background);
    transition: .5s;
  }

  input:checked + .slider {
    background-color: #522ba7;
  }

  input:checked + .slider:before {
    transform: translateX(100%);
    box-shadow: inset 15px -4px 0px 15px #fff000;
  }`;

export default DarkModeToggle;
