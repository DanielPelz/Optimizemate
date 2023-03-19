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

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Project = ({ project, onProjectClick }) => {
  const handleClick = () => {
    onProjectClick(project.id);
  };

  return (
    <div
      className={`bg-white shadow-md rounded p-4 mb-4 block cursor-pointer ${
        project.selected ? "bg-blue-100" : ""
      }`}
      onClick={handleClick}
    >
      <h2 className="text-2xl mb-2">{project.url}</h2>
      <p>
        <strong>Erstellt am:</strong>
        {new Date(project.createdAt).toLocaleString()}
      </p>
      <Link to={`/projects/${project.id}`} className="btn btn-primary">
        Mehr Details
      </Link>
    </div>
  );
};

const Projects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
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
          throw new Error("Failed to fetch latest projects");
        }

        setProjects(response.data);
      } catch (err) {
        setError("Failed to fetch latest projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchLatestprojects();
    }
  }, [user]);

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
          throw new Error("Failed to create a new project");
        }
        setIsLoading(false);
        
      } catch (err) {
        setError("Failed to create a new project. Please try again.");
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
      if (projects.length >= 3) {
        alert("Please upgrade to a higher plan to add more projects.");
      } else {
        setIsLoading(true);
        setLoadingMessage("Creating project...");
  
        try {
          const newProject = await createProject(inputUrl);
          console.log(newProject);
          if (
            newProject &&
            !projects.some((project) => project.id === newProject.id)
          ) {
            // Format the new project
            const formattedNewProject = {
              id: newProject.id,
              url: inputUrl,
              createdAt: Date().toLocaleString(),
              selected: false,
            };
            setProjects((prevProjects) => [
              formattedNewProject,
              ...prevProjects,
            ]);
          }
  
          // Set the loading state to false when the process is complete
          setIsLoading(false);
          
          setOpen(false);
          setInputUrl("");
        
        } catch (error) {
          setLoadingMessage("Error loading");
          setIsLoading(false);
          // Show an error message to the user
          // ...
        }
      }
    } else {
      // Handle empty URL input
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
      setError("Failed to delete projects. Please try again.");
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
        setError("Failed to delete all projects. Please try again.");
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
            <LoadingScreen loadingMessage={loadingMessage} />
        </div>
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-white border-2 border-dashed rounded p-4 mb-4 block cursor-pointer flex items-center justify-center"
              onClick={handleClickOpen}
            >
              <span className="text-4xl">+</span>
              <span className="ml-2">Add Project</span>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add Project</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter the URL you would like to check.
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
                  Cancel
                </Button>
                <Button onClick={handleAddProject} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
            {projects.slice(0, 3).map((project, index) => (
              <Project
                onAddProject={handleAddProject}
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
