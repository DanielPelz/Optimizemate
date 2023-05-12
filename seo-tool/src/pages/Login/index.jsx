// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/projects");
    } catch (err) {
      setError("Fehler beim Einloggen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Einloggen</h1>
      {error && <div className="bg-red-500 p-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label htmlFor="email" className="block mb-2">
            E-Mail:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Passwort:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:text-gray-900"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Einloggen
        </button>
      </form>
    </div>
  );
};

export default Login;
