import { createContext, useState } from "react";

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // Login function
  const loggedInUser = (data) => {;
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data)); // Save session
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear session
  };



  return (
    <AuthContext.Provider value={{ user,setUser, loggedInUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
