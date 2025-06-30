import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { 
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiX
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Backend= import.meta.env.VITE_BACKEND_URL;
const CACHE_KEY = 'pastEventsCache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Cache functions
  const getCachedEvents = () => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    try {
      const { data, timestamp } = JSON.parse(cache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch (error) {
      console.error('Error parsing cache:', error);
    }
    return null;
  };

  const setCachedEvents = (data) => {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cached = getCachedEvents();
        if (cached) {
          setPastEvents(cached);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${Backend}/api/v1/events/past`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setPastEvents(response.data.events);
          setCachedEvents(response.data.events);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to load events';
        toast.error(errorMessage);
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = pastEvents?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pastEvents?.length / itemsPerPage);

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm ${
      status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
      status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <ToastContainer theme="colored" />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2d3748] dark:text-white mb-8">Past Events Archive</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEvents?.length > 0 ? (
                currentEvents.map((event) => (
                  <div key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#992787] dark:text-purple-400">{event.eventCode}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.clientName}</p>
                      </div>
                      <StatusBadge status={event.status} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-[#992787] dark:text-purple-400" />
                        <span className="dark:text-gray-300">
                          {moment(event.eventDate).format('DD MMM YYYY')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-[#992787] dark:text-purple-400" />
                        <span className="dark:text-gray-300">{event.eventLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-[#992787] dark:text-purple-400" />
                        <span className="dark:text-gray-300">{event.numberOfAttendees} attendees</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-[#992787] hover:text-[#7a1f6e] flex items-center gap-2 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        <FiEye className="w-5 h-5" />
                        <span className="dark:text-gray-300">View Details</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block p-4 bg-[#992787]/10 rounded-full mb-4 dark:bg-purple-400/20">
                    <FiInfo className="text-3xl text-[#992787] dark:text-purple-400" />
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-300">No past events found</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pastEvents?.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-[#992787]">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-[#2d3748] dark:text-white">Event Details</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Event Code</p>
                    <p className="font-medium dark:text-gray-200">{selectedEvent.eventCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <StatusBadge status={selectedEvent.status} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#992787] dark:text-purple-400" />
                    <span className="font-medium dark:text-gray-200">
                      {moment(selectedEvent.eventDate).format('DD MMM YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[#992787] dark:text-purple-400" />
                    <span className="font-medium dark:text-gray-200">{selectedEvent.eventLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-[#992787] dark:text-purple-400" />
                    <span className="font-medium dark:text-gray-200">{selectedEvent.numberOfAttendees} attendees</span>
                  </div>
                  {selectedEvent.reason && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-300 font-medium">Rejection Reason:</p>
                      <p className="text-red-500 dark:text-red-400">{selectedEvent.reason}</p>
                    </div>
                  )}
                  {selectedEvent.additionalNotes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Additional Notes</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedEvent.additionalNotes}</p>
                    </div>
                  )}
                  {selectedEvent?.invoiceItems?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Invoice Items</p>
                      <div className="space-y-2">
                        {selectedEvent.invoiceItems.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="dark:text-gray-300">{item.description}</span>
                            <span className="dark:text-gray-300">R{parseFloat(item.amount).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;