import { createContext, useState, useEffect } from "react";
import api from "../../api/userService";
import jwt_decode from "jwt-decode";
import socket from "../Socket/Socket";

export const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (isTokenExpired(parsedUser.token)) {
        logout();
      } else {
        setUser(parsedUser);
        let socketUser = parsedUser.username;

        socket.auth = { socketUser };
        socket.connect();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/register", {
        username,
        email,
        password,
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
