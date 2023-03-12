import React, { useState } from "react";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";
import ResultsBox from "../../components/ResultsBox";
import './Home.css';

const Home = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/seocheck", { url });
      setResults(response.data);
      setIsLoading(false);
      setShowNavbar(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={showNavbar ? "" : "home-page bg-gray-100 min-h-screen flex flex-col items-center justify-center"}>
      <div className={showNavbar ? "top-fixed flex gap-1 items-center px-6" : "top"}>
      <h1 className={showNavbar ? " flex items-center flex-auto w-5 title text-6xl font-bold text-blue-500" : "title text-6xl font-bold text-blue-500 mb-12"}>optimizemate.de</h1>
      <form onSubmit={handleSubmit} className={showNavbar ? " flex items-center gap-5  flex-auto w-auto flex-row" : "flex  flex-col items-center mb-8"} >
        <label htmlFor="url" className={showNavbar ? "hidden" : "text-lg font-medium mb-2"}>URL eingeben:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className={showNavbar ? "px-4 py-2 border border-gray-400 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" : "px-4 py-2 border border-gray-400 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"}
        />
        <button type="submit" className="submit-button bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 hover:scale-110">
          Überprüfen
        </button>
      </form>
      </div>

      {isLoading && <LoadingScreen />}

      {results && <ResultsBox data={results} />}
    </div>
  );
};

export default Home;
