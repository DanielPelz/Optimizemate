import React, { lazy, Suspense, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { AuthContext } from "./contexts/AuthContext/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Service from "./pages/seo-service";
import Projects from "./pages/Projects";
import CheckDetails from "./components/CheckDetails/";
import "./App.css";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <CheckDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/service"
            element={
              <ProtectedRoute>
                <Service />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
