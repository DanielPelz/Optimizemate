// src/components/CheckDetails.js
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import ResultsBox from "../ResultsBox";
import axios from "axios";
import LoadingScreen from "../LoadingScreen";
import "./CheckDetails.css";

const CheckDetails = () => {
  const [check, setCheck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchCheckDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/projects/${id}`,
          {
            headers: {
              Authorization: user ? user.token : "",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch check details");
        }

        setCheck(response.data);
      } catch (err) {
        setError("Failed to fetch check details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckDetails();
  }, [user, id]);

  if (loading) {
    return <LoadingScreen message="Projekt wird geladen" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!check) {
    return <div>Check not found</div>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex flex-row   bg-gray-100 dark:bg-gray-700 p-5 my-5 shadow-md rounded-md">
        <div className="w-3/5 mr-5">
          <h2 className="text-xl font-bold mb-2   p-3 bg-gray-800 rounded-md">
            {check.title}
          </h2>
          <div className="flex justify-between my-2">
            <a className="font-bold" href={check.url}>
              {check.url}
            </a>
            <p>
              <strong>ID:</strong> {check._id}
            </p>
          </div>
          {check.homepageData.metrics && (
            <div className="">
              <p className="flex justify-between">
                Durchschnitliche Antowrtzeit:{" "}
                <b>
                  {
                    check.homepageData.metrics.responseTime
                      .averageResponseTimeInSeconds
                  }
                  s
                </b>
              </p>
              <p className="flex justify-between">
                GZIP Komprimierung:
                <b> {check.homepageData.metrics.gzip ? "ja" : "nein"}</b>
              </p>
              <p className="flex justify-between">
                Durchschnitliche CSS Datein:{" "}
                <b>{check.homepageData.metrics.cssFiles}</b>
              </p>
              <p className="flex justify-between">
                Durchschnittliche Javascript Datein:{" "}
                <b>{check.homepageData.metrics.jsFiles}</b>
              </p>
            </div>
          )}
        </div>
        <div className="image-preview-container rounded overflow-hidden w-2/5">
          {check.screenshot && (
            <img
              className="image-preview"
              src={`data:image/png;base64,${check.screenshot}`}
              alt="Screenshot preview"
            />
          )}
        </div>
      </div>

      <div className="flex flex-row items-center">
        <div className="w-2/4">
          <strong>Checked at:</strong>
          <div className=" ">{new Date(check.createdAt).toLocaleString()}</div>
        </div>
        <div className="w-2/4 flex justify-end">
          <span>
            Untersuchte Seiten:{" "}
            <div className="center ml-4 relative inline-block select-none whitespace-nowrap rounded-lg bg-blue-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
              {check.urlCounter}
            </div>
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center mt-5">
        <ResultsBox
          pageData={{ [check.url]: check.homepageData, ...check.pageData }}
        />
      </div>
    </div>
  );
};

export default CheckDetails;
