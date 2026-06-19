import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const plan = localStorage.getItem("plan");
    if (token && username) {
      setUser({ token, username, plan: plan || "free" });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("plan", userData.plan || "free");
    setUser({ 
      token: userData.token, 
      username: userData.username, 
      plan: userData.plan || "free" 
    });
  };

  const updateLocalPlan = (newPlan) => {
    localStorage.setItem("plan", newPlan);
    setUser(prev => prev ? { ...prev, plan: newPlan } : null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("plan");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateLocalPlan, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
