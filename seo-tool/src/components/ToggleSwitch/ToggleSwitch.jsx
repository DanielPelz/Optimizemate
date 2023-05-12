// src/components/ToggleSwitch/ToggleSwitch.js
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext/ThemeContext';
import { BsFillMoonFill, BsFillSunFill }  from "react-icons/bs";

const ToggleSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <label className="flex items-center cursor-pointer m-0">
      <div className="relative">
        <input
          type="checkbox"
          className="hidden"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="toggle__line w-7 h-2 bg-gray-400 rounded-full shadow-inner"></div>
        <div className={`toggle__dot absolute w-4 h-4 bg-white rounded-full shadow left-0  -top-1 transition ${theme === 'dark' ? 'translate-x-full' : ''}`}></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium dark:text-white">
        {theme === 'light' ?  <BsFillSunFill />  :  <BsFillMoonFill /> }
      </div>
    </label>
  );
};

export default ToggleSwitch;
