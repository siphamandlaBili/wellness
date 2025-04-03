import { createContext, useState } from "react";

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  //event
  const [userEvents, setEvent] = useState(() => {
    return JSON.parse(localStorage.getItem("event")) || null;
  });

  const setEventStorage = (data) => {;
    setEvent(data);
    localStorage.setItem("event", JSON.stringify(data)); // Save session
  };
  // Login function
  const loggedInUser = (data) => {;
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data)); // Save session
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
    localStorage.removeItem("event")
  };



  return (
    <AuthContext.Provider value={{ user,setUser, loggedInUser, logout,setEventStorage,userEvents }}>
      {children}
    </AuthContext.Provider>
  );
};
