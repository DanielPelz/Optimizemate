// src/components/Navbar/Navbar.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className=" bg-white dark:bg-gray-800 py-4 shadow-md p-4 flex justify-between items-center  ">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold dark:text-white">
          optimizemate.de
        </Link>
        <div className="flex items-center">
          <div className="hidden md:flex">
            <Link to="/service" className="ml-4 dark:text-white">
              Service
            </Link>
            {user ? (
              <>
                <button
                  className="relative ml-4 dark:text-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Profile
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 z-10 dark:bg-gray-700 dark:text-white">
                    <Link
                      to="/projects"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Projekte
                    </Link>
                    <ToggleSwitch />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="ml-4 dark:text-white">
                  Login
                </Link>
                <Link to="/signup" className="ml-4 dark:text-white">
                  Registrieren
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              className="focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 text-gray-700 z-10 dark:bg-gray-700 dark:text-white">
                <Link
                  to="/service"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Service
                </Link>
                {user ? (
                  <>
                    {" "}
                    <Link
                      to="/projects"
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Projekte
                    </Link>
                    <ToggleSwitch />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Registrieren
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
