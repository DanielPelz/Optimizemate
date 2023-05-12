import React, { useState, useEffect, useContext, useReducer } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./Projects.css";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Project = ({ project, onProjectClick }) => {
  const handleClick = () => {
    onProjectClick(project.id);
  };

  return (
    <div
      className={`shadow-lg rounded-md p-4 mb-4 dark:bg-gray-700 block transition-all cursor-pointer ${
        project.selected ? "bg-blue-100" : "bg-white"
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl mb-2 rounded-xl bg-gray-100 dark:bg-gray-600 w-100 p-2 px-5 text-sm flex items-center">
          <AiOutlineInfoCircle className="mr-2" />
          {project.url}
        </h2>
        <p>
          <strong>Erstellt am:</strong>
          {new Date(project.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between items-center my-5">
        <Link to={`/projects/${project.id}`} className="relative">
          <a className="absolute inset-0 z-10 p-5 bg-white dark:bg-gray-800 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-80 duration-300">
            <b>{project.title}</b>
            <p className="mx-auto">{project.description}</p>
            <hr class="h-px my-8 bg-gray-300 border-0 dark:bg-gray-700 w-1/2" />

            <span>
              Untersuchte Seiten:{" "}
              <div className="center relative inline-block select-none whitespace-nowrap rounded-lg bg-blue-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                {project.urlCounter}
              </div>
            </span>
          </a>
          <img
            className="rounded-md"
            src={`data:image/png;base64,${project.screenshot}`}
          />
        </Link>
      </div>
    </div>
  );
};

const Projects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedprojects, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD":
        return new Set([...state, action.id]);
      case "REMOVE":
        state.delete(action.id);
        return new Set(state);
      case "TOGGLE":
        return state.has(action.id)
          ? new Set([...state].filter((id) => id !== action.id))
          : new Set([...state, action.id]);
      default:
        return state;
    }
  }, new Set());

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
  useEffect(() => {
    const fetchLatestprojects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/projects`, {
          headers: {
            Authorization: user ? user.token : "",
          },
        });

        if (response.status !== 200) {
          throw new Error(
            response.data.message ||
              "Letzte Projekte konnten nicht abgerufen werden"
          );
        }

        setProjects(response.data);
      } catch (err) {
        setError(
          err.message ||
            "Die letzten Projekte konnten nicht abgerufen werden. Bitte versuchen Sie es erneut."
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchLatestprojects();
    }
  }, [user]);

  const setLoadingMessage = (message) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      newProjects[currentLoadingMessageIndex] = message;
      return newProjects;
    });
  };

  const createProject = async (url) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `${apiBaseUrl}/api/projects/create-check`,
          { url },
          {
            headers: {
              Authorization: user ? user.token : "",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Ein neues Projekt konnte nicht erstellt werden");
        }
        setIsLoading(false);
        resolve(response.data);
      } catch (err) {
        setError(
          err.message || "Ein neues Projekt konnte nicht erstellt werden"
        );
        // Reject the promise if an error occurs
        reject(err);
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProjectClick = (id) => {
    dispatch({ type: "TOGGLE", id });
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, selected: !project.selected }
          : project
      )
    );
  };

  const handleAddProject = async () => {
    if (inputUrl) {
      setIsLoading(true);
      setCurrentLoadingMessageIndex(0);

      try {
        const newProject = await createProject(inputUrl);

        if (newProject || !error) {
          const formattedNewProject = {
            id: newProject.id,
            url: inputUrl,
            createdAt: Date().toLocaleString(),
            selected: false,
            screenshot: newProject.homepageData.screenshot,
            title: newProject.title,
            description: newProject.description,
            urlCounter: newProject.urlCounter,
          };
          setProjects((prevProjects) => [formattedNewProject, ...prevProjects]);
          setOpen(false);
          setInputUrl("");
        }
      } catch (error) {
        setLoadingMessage("Ein neues Projekt konnte nicht erstellt werden");
        setIsLoading(false);
        // Zeige Fehlermeldung an

        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message ===
            "You have exceeded your plan's limits."
        ) {
          setError(
            "Sie haben das Limit Ihres Plans erreicht. Bitte wechseln Sie zu einem höheren Plan, um mehr Projekte hinzuzufügen."
          );
        } else {
          setError(
            error.message || "Ein neues Projekt konnte nicht erstellt werden"
          );
        }
      }
    } else {
      // Leere Url
      alert("Bitte geben Sie eine gültige URL ein.");
    }
  };
  const handleDeleteSelected = async () => {
    try {
      // Ausgewählte löschen im Backend
      await axios.post(
        `${apiBaseUrl}/api/projects/delete-checks`,
        { ids: Array.from(selectedprojects) },
        { headers: { Authorization: user ? user.token : "" } }
      );
      // Ausgewählte aus dem Array entfernen
      setProjects(
        projects.filter((project) => !selectedprojects.has(project.id))
      );
      // Ausgewählte rausnehmen
      dispatch({ type: "CLEAR" });
    } catch (error) {
      setError(error.message || "Failed to delete projects. Please try again.");
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all projects?")) {
      try {
        // Alle Projekte löschen im Backend
        await axios.post(
          `${apiBaseUrl}/api/projects/delete-all-checks`,
          {},
          { headers: { Authorization: user ? user.token : "" } }
        );
        //alle Projekte löschen
        setProjects([]);
      } catch (error) {
        setError(
          error.message ||
            "Es konnten nicht alle Projekte gelöscht werden. Bitte versuchen Sie es erneut."
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Projekte</h1>
      <div className="flex justify-between items-center mb-4">
        <span>{selectedprojects.size} Ausgewählt</span>
        <div>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              selectedprojects.size === 0 && "opacity-50"
            }`}
            onClick={handleDeleteSelected}
            disabled={selectedprojects.size === 0}
          >
            ausgewählte löschen
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded ml-4"
            onClick={handleDeleteAll}
          >
            alle löschen
          </button>
        </div>
      </div>
      {error && <div className="bg-red-500 p-2 mb-4">{error}</div>}
      {isLoading ? (
        <div className="flex justify-center mt-5">
          <LoadingScreen
            loadingMessage={loadingMessages[currentLoadingMessageIndex]}
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-white dark:bg-gray-700 border-2 border-dashed rounded p-4 mb-4 block cursor-pointer flex items-center justify-center"
              onClick={handleClickOpen}
            >
              <span className="text-4xl">+</span>
              <span className="ml-2">Projekt hinzufügen</span>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Projekt hinzufügen
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bitte geben Sie die URL ein, die Sie überprüfen möchten.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="url"
                  label="URL"
                  type="url"
                  fullWidth
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Abbrechen
                </Button>
                <Button onClick={handleAddProject} color="primary">
                  hinzufügen
                </Button>
              </DialogActions>
            </Dialog>
            {projects.slice(0, 3).map((project, index) => (
              <Project
                key={project.id}
                project={project}
                onProjectClick={handleProjectClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
