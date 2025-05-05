import React, { useState, useEffect } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardList,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://wellness-backend-ntls.onrender.com',
  withCredentials: true
});

const AssignEventToNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [events, setEvents] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState({});

  const availableEvents = events.filter(e => !e.assignedNurse);
  const assignedEvents = events.filter(e => e.assignedNurse);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nurseRes, eventRes] = await Promise.all([
          API.get('/api/v1/nurses'),
          API.get('/api/v1/events')
        ]);

        const nursesData = nurseRes.data.users.map(n => ({
          ...n,
          id: n._id,
          assignedEvents: n.assignedEvents || []
        }));

        const acceptedEvents = eventRes.data.events.filter(e => e.status === 'Accepted');
        const map = {};

        acceptedEvents.forEach(event => {
          if (event.assignedNurse) {
            if (!map[event.assignedNurse]) map[event.assignedNurse] = [];
            map[event.assignedNurse].push(event._id);
          }
        });

        setNurses(nursesData);
        setEvents(acceptedEvents);
        setAssignedMap(map);
      } catch (error) {
        toast.error('Failed to load data: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignEvent = async (nurseId, eventId) => {
    const isUnassign = assignedMap[nurseId]?.includes(eventId);
    const backupEvents = [...events];
    const backupMap = { ...assignedMap };
    const backupSelected = { ...selectedEvents };

    try {
      // Update selected event state
      setSelectedEvents(prev => ({ ...prev, [nurseId]: eventId }));

      // Optimistic UI updates
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? { ...event, assignedNurse: isUnassign ? null : nurseId }
            : event
        )
      );

      setAssignedMap(prev => {
        const updated = { ...prev };
        updated[nurseId] = isUnassign
          ? (updated[nurseId] || []).filter(id => id !== eventId)
          : [...(updated[nurseId] || []), eventId];
        return updated;
      });

      // Server request
      const { data } = await API.put('/api/v1/events/assign-nurse', {
        nurseId,
        eventId,
        action: isUnassign ? 'unassign' : 'assign'
      });

      if (!data.success) throw new Error(data.message);

      // Reset select input after success
      setSelectedEvents(prev => ({ ...prev, [nurseId]: '' }));

      // Update with server response
      setEvents(prev =>
        prev.map(event => (event._id === data.event._id ? data.event : event))
      );

      setNurses(prev =>
        prev.map(n => (n.id === data.nurse._id ? { ...n, ...data.nurse } : n))
      );

      toast.success(
        `Event ${data.event.eventCode} ${isUnassign ? 'unassigned' : 'assigned'} successfully`,
        { icon: <HiOutlineMail className="text-[#992787] dark:text-purple-400" /> }
      );
    } catch (error) {
      // Revert states on error
      setEvents(backupEvents);
      setAssignedMap(backupMap);
      setSelectedEvents(backupSelected);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787]"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="container mx-auto max-w-7xl p-6 min-h-screen dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-8 text-[#2d3748] dark:text-gray-100">
            Nurse Event Assignment
          </h1>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {nurses.map(nurse => {
              const nurseEvents = assignedEvents.filter(e => e.assignedNurse === nurse.id);
              return (
                <div
                  key={nurse.id}
                  className="p-5 rounded-xl border shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center text-sm font-medium dark:text-gray-100">
                      <HiOutlineUser className="mr-2 text-[#992787] dark:text-purple-400" />
                      {nurse.fullName}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2 dark:text-gray-300">
                        {nurseEvents.length} assigned
                      </span>
                      {nurseEvents.length > 0 ? (
                        <HiOutlineCheckCircle className="text-green-500" />
                      ) : (
                        <HiOutlineXCircle className="text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <HiOutlineMail className="mr-2 text-[#992787] dark:text-purple-400" />
                    {nurse.email}
                  </div>

                  <div className="space-y-2 mb-3">
                    {nurseEvents.map(event => (
                      <div
                        key={event._id}
                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium dark:text-gray-300">{event.eventCode}</p>
                          <p className="text-xs dark:text-gray-400">{event.eventName}</p>
                        </div>
                        <button
                          onClick={() => handleAssignEvent(nurse.id, event._id)}
                          className="text-red-500 text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Unassign
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <select
                      value={selectedEvents[nurse.id] || ''}
                      onChange={e => handleAssignEvent(nurse.id, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm border-[#992787]/30 dark:border-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="" disabled>
                        Assign new event...
                      </option>
                      {availableEvents.map(event => (
                        <option key={event._id} value={event._id}>
                          {event.eventCode} - {event.eventName}
                        </option>
                      ))}
                    </select>
                    <HiOutlineClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border shadow border-gray-100 dark:border-gray-700 mt-6">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-[#992787]/10 dark:bg-purple-400/20">
                <tr>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">Nurse</th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">Email</th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">Assigned Events</th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">Assign New Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {nurses.map(nurse => {
                  const nurseEvents = assignedEvents.filter(e => e.assignedNurse === nurse.id);
                  return (
                    <tr key={nurse.id} className="hover:bg-[#f9f4f9] dark:hover:bg-gray-700">
                      <td className="py-4 px-6 font-medium dark:text-gray-100">{nurse.fullName}</td>
                      <td className="py-4 px-6 dark:text-gray-300">{nurse.email}</td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          {nurseEvents.map(event => (
                            <div key={event._id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <div>
                                <p className="text-sm dark:text-gray-300 font-medium">{event.eventCode}</p>
                                <p className="text-xs dark:text-gray-400">{event.eventName}</p>
                              </div>
                              <button
                                onClick={() => handleAssignEvent(nurse.id, event._id)}
                                className="text-red-500 text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                Unassign
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <select
                            value={selectedEvents[nurse.id] || ''}
                            onChange={e => handleAssignEvent(nurse.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm border-[#992787]/30 dark:border-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="" disabled>
                              Select event...
                            </option>
                            {availableEvents.map(event => (
                              <option key={event._id} value={event._id}>
                                {event.eventCode} - {event.eventName}
                              </option>
                            ))}
                          </select>
                          <HiOutlineClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#992787]/10 dark:bg-purple-400/20 text-sm text-center text-[#992787] dark:text-purple-300">
            <div className="flex justify-center items-center gap-2">
              <HiOutlineInformationCircle className="w-5 h-5" />
              Nurses can be assigned to multiple events. Notifications are sent upon new assignments.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignEventToNurse;