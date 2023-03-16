import React, { useState, useContext  } from "react";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";
import ResultsBox from "../../components/ResultsBox";
import './Home.css';
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const Home = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/seocheck", { url }, {
        headers: {
          'Authorization': user ? user.token : '',
        },
      });
      setResults(response.data);
      setIsLoading(false);
     
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={"home-page bg-gray-100 min-h-screen flex flex-col items-center justify-center"}>
      <div className={ "top"}>
      <h1 className={"title text-6xl font-bold text-blue-500 mb-12"}>optimizemate.de</h1>
      <form onSubmit={handleSubmit} className={"flex  flex-col items-center mb-8"} >
        <label htmlFor="url" className={"text-lg font-medium mb-2"}>URL eingeben:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className={"px-4 py-2 border border-gray-400 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"}
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
