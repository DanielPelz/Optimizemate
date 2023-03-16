import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;