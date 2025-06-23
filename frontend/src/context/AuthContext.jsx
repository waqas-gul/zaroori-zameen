import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../App";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${Backendurl}/api/users/me`);

      if (response.data) {
        setUser(response.data);
        setIsLoggedIn(true);
        // Save userId for logout use
        if (response.data._id) {
          localStorage.setItem("userId", response.data._id);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    if (userData?._id) {
      localStorage.setItem("userId", userData._id);
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    const userId = localStorage.getItem("userId");

    try {
      if (userId) {
        const response = await axios.put(
          `${Backendurl}/api/users/${userId}`,
          { isActive: false },
          {
            headers: {
              "Content-Type": "application/json",
            },
            validateStatus: (status) => status < 500, // Accept 4xx errors
          }
        );
      }
    } catch (error) {
      console.error(
        "Error updating isActive status during logout:",
        error.response?.data || error.message
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
