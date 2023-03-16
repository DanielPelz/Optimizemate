// src/pages/History.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import axios from "axios";

const History = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLatestChecks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/latest-checks",
          {
            headers: {
              Authorization: user ? user.token : "",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch latest checks");
        }

        setChecks(response.data);
      } catch (err) {
        setError("Failed to fetch latest checks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestChecks();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">History</h1>
      {error && <div className="bg-red-500 p-2 mb-4">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {checks.map((check, index) => (
            <div
              key={check._id || index}
              className="bg-white shadow-md rounded p-4 mb-4"
            >
              <h2 className="text-2xl mb-2">{check.url}</h2>
              <p>
                <strong>Checked at:</strong>{" "}
                {new Date(check.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Score:</strong> {check.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
