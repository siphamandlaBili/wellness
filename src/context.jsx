import React, { createContext, useState, useContext } from 'react';

// Creating the context
const AppContext = createContext();

// Context Provider
export const AppProvider = ({ children }) => {
  // User state (can include more fields like email, etc.)
  const [user, setUser] = useState({ id: null, name: '', email: '' });

  // User role ('user' or 'admin')
  const [userRole, setUserRole] = useState('user');

  // Booked events data
  const [bookedEvents, setBookedEvents] = useState([]);

  // Pending events data
  const [pendingEvents, setPendingEvents] = useState([]);

  // Set user information
  const setUserInfo = (userInfo) => setUser(userInfo);

  // Set user role
  const setRole = (role) => setUserRole(role);

  // Add booked event
  const addBookedEvent = (event) => setBookedEvents((prev) => [...prev, event]);

  // Add pending event
  const addPendingEvent = (event) => setPendingEvents((prev) => [...prev, event]);

  // Remove booked event
  const removeBookedEvent = (eventId) =>
    setBookedEvents((prev) => prev.filter((event) => event.id !== eventId));

  // Remove pending event
  const removePendingEvent = (eventId) =>
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));

  // Approve event (move from pending to booked)
  const approveEvent = (eventId) => {
    const eventToApprove = pendingEvents.find((event) => event.id === eventId);
    if (eventToApprove) {
      // Add event to booked events
      setBookedEvents((prev) => [...prev, eventToApprove]);
      // Remove event from pending events
      setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));
    }
  };

  // Decline event (remove from pending events)
  const declineEvent = (eventId) => {
    setPendingEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUserInfo,
        userRole,
        setRole,
        bookedEvents,
        addBookedEvent,
        removeBookedEvent,
        pendingEvents,
        addPendingEvent,
        removePendingEvent,
        approveEvent,
        declineEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);
