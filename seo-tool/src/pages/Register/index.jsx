// src/pages/Register.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError("Fehler bei der Registrierung. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Registrieren</h1>
      {error && <div className="bg-red-500 p-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label htmlFor="username" className="block mb-2">
            Benutzername:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:text-gray-900"
          />
        </div>
        <div className="mb-4">
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
          <label htmlFor="password" className="block mb-2  ">
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
        <div className="mb-4">
          <label htmlFor="confirm-password" className="block mb-2">
            Passwort bestätigen:
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:text-gray-900"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded ">
          Registrieren
        </button>
      </form>
    </div>
  );
};

export default Register;
