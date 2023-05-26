// src/components/Navbar/Navbar.js
import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { BiArrowToLeft } from "react-icons/bi";
import { BsCloud, BsTrash } from "react-icons/bs";
import { TfiClose, TfiReload } from "react-icons/tfi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import LoadingScreen from "../LoadingScreen";
import axios from "axios";
import "./Navbar.css";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith("/projects/");
  let projectId = null;

  const loadingMessages = [
    "Projekt wird erstellt...",
    "Einen Moment bitte...",
    "Fast fertig...",
  ];
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] =
    useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentLoadingMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  if (isProjectPage) {
    const pathParts = location.pathname.split("/");
    if (pathParts.length > 2) {
      projectId = pathParts[2];
    }
  }

  const renewCheck = async () => {
    setIsLoading(true);
    if (!isProjectPage || !projectId) {
      setCurrentLoadingMessageIndex(0);
      console.error("Project ID missing or not on project page.");
      return;
    }

    try {
      const checkId = projectId;

      await axios.post(
        `${apiBaseUrl}/api/projects/renew-check`,
        { id: checkId },
        { headers: { Authorization: user ? user.token : "" } }
      );

      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to renew check. Please try again.");
    }
  };

  const deleteProjekt = async () => {
    if (!isProjectPage || !projectId) {
      console.error("Project ID missing or not on project page.");
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}/api/projects/delete-checks`,
        { ids: projectId },
        { headers: { Authorization: user ? user.token : "" } }
      );
      window.location.href = "/projects";
    } catch (error) {
      console.error("Failed to delete project. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };
  if (isLoading) {
    return (
      <LoadingScreen
        loadingMessage={loadingMessages[currentLoadingMessageIndex]}
      />
    );
  }
  return (
    <nav className=" bg-white dark:bg-gray-800 py-4 shadow-md p-4 flex justify-between items-center  ">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {isProjectPage ? (
          <Link to="/projects" className="text-base dark:text-white">
            <BiArrowToLeft className="inline-block mr-2 text-2xl hover:scale-110 transition-all" />
          </Link>
        ) : (
          <Link to="/" className="text-2xl font-bold dark:text-white">
            optimizemate.de
          </Link>
        )}
        <div className="flex items-center">
          <div className="hidden md:flex">
            {user ? (
              <>
                <button
                  className="relative ml-4 dark:text-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Profile
                </button>
                {isProjectPage ? (
                  <div className="ml-4 dark:text-white">
                    <button
                      onClick={renewCheck}
                      className="border-green-400 bg-green-300 p-1 text-green-700  rounded border mr-2"
                    >
                      <TfiReload className="cursor-pointer h-4 w-4" />
                    </button>
                    <button
                      onClick={deleteProjekt}
                      className="border-red-400 bg-red-300 p-1 text-red-700  rounded border"
                    >
                      <BsTrash className="cursor-pointer h-4 w-4" />
                    </button>
                  </div>
                ) : null}
                {isOpen && (
                  <div
                    className={`${
                      isOpen ? "open" : "closed"
                    } sidemenu fixed h-full top-0 right-0 m-0   w-64 bg-white  shadow-lg py-1 text-gray-700 z-10 dark:bg-gray-700 dark:text-white`}
                  >
                    <a
                      className="absolute right-3 top-3"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <TfiClose className="cursor-pointer" />
                    </a>
                    <div className="sidebar-list p-4">
                      <div className="sidebar-profile">
                        <h3 className="text-xl">Hi, {user.username} </h3>
                        {user.servicePlan && (
                          <div
                            className={`${
                              user.servicePlan == "free"
                                ? "bg-green-600"
                                : "bg-blue-800"
                            } light:text-white plan rounded-xl w-16 text-center text-sm my-2 capitalize`}
                          >
                            {user.servicePlan}
                          </div>
                        )}
                      </div>
                      <Link
                        to="/projects"
                        className="block   py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Projekte
                      </Link>
                    </div>

                    <div className="absolute right-0 bottom-0 left-0">
                      <div className="sidemenu-upgrade">
                        {user.servicePlan == "free" && "standard" && (
                          <div className="dark:bg-violet-900 font-bold cursor-pointer link-upgrade p-4 relative overflow-hidden">
                            Upgrade to Pro
                            <HiOutlineRocketLaunch className="absolute right-3 top-0  transition-all text-6xl opacity-20" />
                            <div className="clouds absolute right-0">
                              <BsCloud className="cloud-1" />
                              <BsCloud className="cloud-2" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="sidemenu-bottom-options p-4  w-full bg-gray-100 flex flex-row text-gray-700 z-10 dark:bg-gray-800 dark:text-white">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left  text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Logout
                        </button>
                        <ToggleSwitch />
                      </div>
                    </div>
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
                {user ? (
                  <>
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
