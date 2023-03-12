import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <FaSpinner className="spinner-icon" />
      <p>Seite wird analysiert, bitte warten...</p>
    
    </div>
  );
};

export default LoadingScreen;