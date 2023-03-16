// src/components/ToggleSwitch/ToggleSwitch.js
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext/ThemeContext';

const ToggleSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="hidden"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
        <div className={`toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${theme === 'dark' ? 'translate-x-full' : ''}`}></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium">
        {theme === 'light' ? 'Light' : 'Dark'}
      </div>
    </label>
  );
};

export default ToggleSwitch;
