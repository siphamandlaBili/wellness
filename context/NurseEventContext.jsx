import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NurseEventContext = createContext();

export const NurseEventProvider = ({ children }) => {
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventData = async () => {
    try {
      const { data } = await axios.get(
        'https://wellness-backend-ntls.onrender.com/api/v1/events/nurse/next-event',
        { withCredentials: true }
      );
      
      if (!data.success) {
        throw new Error('Failed to fetch event data');
      }
      
      setEventData(data.event);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setEventData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const value = {
    eventData,
    isLoading,
    error,
    refreshEvent: fetchEventData
  };

  return (
    <NurseEventContext.Provider value={value}>
      {children}
    </NurseEventContext.Provider>
  );
};

export const useNurseEvent = () => {
  const context = useContext(NurseEventContext);
  if (!context) {
    throw new Error('useNurseEvent must be used within a NurseEventProvider');
  }
  return context;
};