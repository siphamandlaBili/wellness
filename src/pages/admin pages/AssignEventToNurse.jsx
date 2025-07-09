import React, { useState, useEffect } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardList,
  HiOutlineInformationCircle,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineSearch
} from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Backend = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
  baseURL: `${Backend}`,
  withCredentials: true
});

const AssignEventToNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [events, setEvents] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableEvents = events?.filter(e => !e.assignedNurse);
  const assignedEvents = events?.filter(e => e.assignedNurse);

  // Filter nurses based on search term
  const filteredNurses = nurses?.filter(nurse => 
    nurse.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nurse.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const [nurseRes, eventRes] = await Promise.all([
        API.get('/api/v1/nurses'),
        API.get('/api/v1/events')
      ]);

      const nursesData = nurseRes?.data?.users?.map(n => ({
        ...n,
        id: n._id,
        assignedEvents: n.assignedEvents || []
      }));

      const acceptedEvents = eventRes?.data?.events?.filter(e => e.status === 'Accepted');
      const map = {};
      
      nursesData?.forEach(nurse => {
        map[nurse.id] = [];
      });

      acceptedEvents?.forEach(event => {
        if (event.assignedNurse) {
          const nurseId = typeof event.assignedNurse === 'string' 
            ? event.assignedNurse 
            : event.assignedNurse._id;
          if (!map[nurseId]) map[nurseId] = [];
          map[nurseId].push(event._id);
        }
      });

      setNurses(nursesData);
      setEvents(acceptedEvents);
      setAssignedMap(map);
    } catch (error) {
      toast.error('Failed to load data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignEvent = async (nurseId, eventId) => {
    const isUnassign = assignedMap[nurseId]?.includes(eventId);
    const backupEvents = [...events];
    const backupMap = { ...assignedMap };
    const backupSelected = { ...selectedEvents };

    try {
      setSelectedEvents(prev => ({ ...prev, [nurseId]: eventId }));

      // Optimistic UI updates
      setEvents(prev =>
        prev?.map(event =>
          event._id === eventId
            ? { ...event, assignedNurse: isUnassign ? null : nurseId }
            : event
        )
      );

      setAssignedMap(prev => {
        const updated = { ...prev };
        updated[nurseId] = isUnassign
          ? (updated[nurseId] || [])?.filter(id => id !== eventId)
          : [...(updated[nurseId] || []), eventId];
        return updated;
      });

      const { data } = await API.put('/api/v1/events/assign-nurse', {
        nurseId,
        eventId,
        action: isUnassign ? 'unassign' : 'assign'
      });

      if (!data.success) throw new Error(data.message);

      setSelectedEvents(prev => ({ ...prev, [nurseId]: '' }));

      setEvents(prev =>
        prev?.map(event => 
          event._id === data.event._id 
            ? { ...event, assignedNurse: data.event.assignedNurse } 
            : event
        )
      );

      setAssignedMap(prev => ({
        ...prev,
        [nurseId]: data.nurse.assignedEvents
      }));

      toast.success(
        `Event ${data.event.eventCode} ${isUnassign ? 'unassigned' : 'assigned'} successfully`,
        { 
          icon: <HiOutlineCheckCircle className="text-green-500" />,
          className: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700'
        }
      );
    } catch (error) {
      setEvents(backupEvents);
      setAssignedMap(backupMap);
      setSelectedEvents(backupSelected);
      toast.error(error.response?.data?.message || error.message, {
        className: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      });
    }
  };

  const getNurseEvents = (nurseId) => {
    return events?.filter(event => {
      if (!event.assignedNurse) return false;
      
      const assignedId = typeof event.assignedNurse === 'string'
        ? event.assignedNurse
        : event.assignedNurse._id;
      
      return assignedId === nurseId;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#992787] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading nurse assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored" 
        toastClassName="rounded-xl shadow-lg"
      />
      
      <div className="container mx-auto max-w-7xl p-4 min-h-screen dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#992787] to-[#7a1f6e] p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Nurse Event Assignment</h1>
                <p className="text-[#e6b8df] mt-1">
                  Assign events to nurses and manage their schedules
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                  <input
                    type="text"
                    placeholder="Search nurses..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder:text-[#e6b8df] focus:outline-none focus:ring-2 focus:ring-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e6b8df]" />
                </div>
                
                <button
                  onClick={fetchData}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <HiOutlineRefresh className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Nurses</p>
              <p className="text-2xl font-bold text-[#992787] dark:text-purple-400">{nurses?.length || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Available Events</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{availableEvents?.length || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Assigned Events</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{assignedEvents?.length || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{events?.length || 0}</p>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden p-4">
            {filteredNurses?.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4">
                  <HiOutlineUser className="text-4xl text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">No nurses found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {searchTerm ? "Try a different search term" : "Add nurses to get started"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredNurses?.map(nurse => {
                  const nurseEvents = getNurseEvents(nurse.id);
                  return (
                    <div
                      key={nurse.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center">
                          <HiOutlineUser className="text-xl text-[#992787] dark:text-purple-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{nurse.fullName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${nurseEvents.length > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                              {nurseEvents.length} assigned
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                            <HiOutlineMail className="mr-2" /> {nurse.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <HiOutlineClipboardList className="mr-2 text-[#992787] dark:text-purple-400" />
                            Assigned Events
                          </h4>
                          
                          {nurseEvents?.length > 0 ? (
                            <div className="space-y-2">
                              {nurseEvents?.map(event => (
                                <div
                                  key={event._id}
                                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                                >
                                  <div>
                                    <p className="font-medium text-sm dark:text-gray-200">{event.eventCode}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{event.eventName}</p>
                                  </div>
                                  <button
                                    onClick={() => handleAssignEvent(nurse.id, event._id)}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full"
                                  >
                                    Unassign
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                              No events assigned yet
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <HiOutlinePlus className="mr-2 text-[#992787] dark:text-purple-400" />
                            Assign New Event
                          </label>
                          <div className="relative">
                            <select
                              value={selectedEvents[nurse.id] || ''}
                              onChange={e => handleAssignEvent(nurse.id, e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#992787]/30 dark:border-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#992787]/50 dark:focus:ring-purple-400/50 focus:border-transparent appearance-none"
                            >
                              <option value="" disabled>Select an event to assign...</option>
                              {availableEvents?.map(event => (
                                <option key={event._id} value={event._id}>
                                  {event.eventCode} - {event.eventName}
                                </option>
                              ))}
                              {availableEvents?.length === 0 && (
                                <option disabled>No available events</option>
                              )}
                            </select>
                            <HiOutlineClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block p-4">
            {filteredNurses?.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-700 w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-6">
                  <HiOutlineUser className="text-5xl text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">No nurses found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  {searchTerm 
                    ? "No nurses match your search. Try a different term." 
                    : "You haven't added any nurses yet. Contact super admin to add nurse accounts"}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                  <thead className="bg-[#f9f4f9] dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="py-4 px-6 text-left text-xs font-medium text-[#992787] dark:text-purple-400 uppercase tracking-wider">Nurse</th>
                      <th scope="col" className="py-4 px-6 text-left text-xs font-medium text-[#992787] dark:text-purple-400 uppercase tracking-wider">Email</th>
                      <th scope="col" className="py-4 px-6 text-left text-xs font-medium text-[#992787] dark:text-purple-400 uppercase tracking-wider">Assigned Events</th>
                      <th scope="col" className="py-4 px-6 text-left text-xs font-medium text-[#992787] dark:text-purple-400 uppercase tracking-wider">Assign New Event</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredNurses?.map((nurse, index) => {
                      const nurseEvents = getNurseEvents(nurse.id);
                      return (
                        <tr 
                          key={nurse.id} 
                          className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
                                <HiOutlineUser className="text-[#992787] dark:text-purple-400" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{nurse.fullName}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {nurseEvents?.length || 0} assigned events
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-900 dark:text-gray-300">
                            <div className="flex items-center">
                              <HiOutlineMail className="mr-2 text-gray-400" />
                              {nurse.email}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {nurseEvents?.length > 0 ? (
                                nurseEvents?.map(event => (
                                  <div 
                                    key={event._id} 
                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm"
                                  >
                                    <div>
                                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{event.eventCode}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{event.eventName}</div>
                                    </div>
                                    <button
                                      onClick={() => handleAssignEvent(nurse.id, event._id)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
                                    >
                                      Unassign
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm italic">
                                  No events assigned
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="relative">
                              <select
                                value={selectedEvents[nurse.id] || ''}
                                onChange={e => handleAssignEvent(nurse.id, e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#992787]/30 dark:border-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#992787]/50 dark:focus:ring-purple-400/50 focus:border-transparent appearance-none"
                              >
                                <option value="" disabled>Select an event...</option>
                                {availableEvents?.map(event => (
                                  <option key={event._id} value={event._id}>
                                    {event.eventCode} - {event.eventName}
                                  </option>
                                ))}
                                {availableEvents?.length === 0 && (
                                  <option disabled>No available events</option>
                                )}
                              </select>
                              <HiOutlineClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="p-4 bg-gradient-to-r from-[#fdf2f8] to-[#f9f4f9] dark:from-gray-750 dark:to-gray-800 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3 max-w-5xl mx-auto">
              <HiOutlineInformationCircle className="flex-shrink-0 text-[#992787] dark:text-purple-400 mt-0.5 text-xl" />
              <p className="text-sm text-[#7a1f6e] dark:text-purple-300">
                Nurses can be assigned to multiple events. When you assign an event to a nurse, they will receive 
                a notification email with event details. Unassigning an event will remove it from the nurse's schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignEventToNurse;