// src/components/CheckDetails.js
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import ResultsBox from "../ResultsBox";
import axios from "axios";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!check) {
    return <div>Check not found</div>;
  }
  console.log(check);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center">
        <div>
          <h2 className="text-2xl mb-2 mr-4">URL: {check.url}</h2>
          <p>
            <strong>ID:</strong> {check._id}
          </p>
        </div>
        <div className="image-preview-container">
          {check.checkData.screenshot && (
            <img
              className="image-preview"
              src={`data:image/png;base64,${check.checkData.screenshot}`}
              alt="Screenshot preview"
            />
          )}
        </div>
      </div>

      <p>
        <strong>Checked at:</strong>{" "}
        {new Date(check.createdAt).toLocaleString()}
        <ResultsBox checkData={check.checkData} />
      </p>
      <p>
        <strong>Score:</strong> {check.score}
      </p>
    </div>
  );
};

export default CheckDetails;
