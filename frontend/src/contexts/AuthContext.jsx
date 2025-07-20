import React, { createContext, useContext, useState, useEffect } from "react";
import { GFG_ROUTES } from "../gfgRoutes/gfgRoutes";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const verify = async () => {
      const token = localStorage.getItem('token');
      try {
      
          // Send token in Authorization header as Bearer
          const response = await axios.get(GFG_ROUTES.VERIFYTOKEN, {
            withCredentials: true, // ✅ always include cookies
            headers: token
              ? { Authorization: `Bearer ${token}` } // ✅ if token exists in localStorage, use it
              : {}, // otherwise rely on cookie
          });
          console.log(response)
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setUser(null);
            // localStorage.removeItem("token");
          }
        
      } catch (error) {
        setUser(null);
        // localStorage.removeItem("token");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
      verify();
    
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post(GFG_ROUTES.LOGIN, userData);
      const { user, token } = response.data;

      setUser(user);
      if (token) {
        localStorage.setItem("token",token);
      } else {
        localStorage.removeItem("token");
      }
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout =  async() => {
    const response = await axios.post(GFG_ROUTES.LOGOUT, {}, { withCredentials: true });
    console.log(response.data); // should show "Logout successful"
    setUser(null);
    localStorage.removeItem("token");

  };

  const value = {
    user,
    login,
    logout,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
