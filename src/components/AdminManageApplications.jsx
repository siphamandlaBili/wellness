import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import { FiMoreVertical, FiCheck, FiX, FiEye, FiGrid, FiList, FiInfo, FiCalendar, FiMapPin, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const AdminManageApplications = () => {
  const { userEvents, setEventStorage } = useContext(AuthContext);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTableView, setIsTableView] = useState(true);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      setIsTableView(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = userEvents?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((userEvents?.length || 0) / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [userEvents]);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status] || 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>
        {status || "Pending"}
      </span>
    );
  };

  const getEvents = async () => {
    try {
      const response = await fetch('https://wellness-temporary-db-2.onrender.com/events');
      const data = await response.json();
      setEventStorage(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (index, newStatus) => {
    try {
      const event = userEvents[index];
      const response = await fetch(`https://wellness-temporary-db-2.onrender.com/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedEvents = userEvents.map((e, i) =>
          i === index ? { ...e, status: newStatus } : e
        );
        setEventStorage(updatedEvents);
        setActiveDropdownIndex(null);
        toast.success(`Event ${newStatus.toLowerCase()} successfully`);
      }
    } catch (error) {
      toast.error('Update failed. Please try again.');
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectionReason.trim() && selectedEventIndex !== null) {
      try {
        const event = userEvents[selectedEventIndex];
        const response = await fetch(`https://wellness-temporary-db-2.onrender.com/events/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: 'Rejected',
            reason: rejectionReason 
          })
        });

        if (response.ok) {
          const updatedEvents = userEvents.map((e, i) =>
            i === selectedEventIndex ? { ...e, status: 'Rejected', reason: rejectionReason } : e
          );
          setEventStorage(updatedEvents);
          setShowRejectModal(false);
          setRejectionReason('');
          toast.success('Event rejected successfully');
        }
      } catch (error) {
        toast.error('Rejection failed. Please try again.');
      }
    }
  };

  const handleDotClick = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  const handleViewDetails = (event) => {
    setSelectedEventDetails(event);
    setActiveDropdownIndex(null);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787] dark:border-purple-400"></div>
    </div>
  );

  if (!userEvents?.length) return (
    <div className="text-center p-8 text-gray-600 dark:bg-gray-900 dark:text-gray-300 min-h-screen">
      <div className="inline-block p-4 bg-[#992787]/10 rounded-full mb-4 dark:bg-purple-400/20">
        <FiInfo className="text-3xl text-[#992787] dark:text-purple-400" />
      </div>
      <p className="text-xl">No event applications found</p>
    </div>
  );

  return (
    <div className="container p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748] dark:text-white">Event Applications</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="p-2 text-[#992787] hover:bg-[#992787]/10 rounded-lg transition-colors dark:text-purple-400 dark:hover:bg-gray-800"
            title={isTableView ? "Switch to Card View" : "Switch to Table View"}
          >
            {isTableView ? <FiGrid className="w-6 h-6" /> : <FiList className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isTableView ? (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-[#992787]/10 dark:bg-purple-400/20">
              <tr>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold dark:text-purple-300">Event Code</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold max-md:hidden dark:text-purple-300">Company</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold dark:text-purple-300">Type</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold max-lg:hidden dark:text-purple-300">Date</th>
                <th className="py-4 px-6 text-center text-[#992787] font-semibold dark:text-purple-300">Status</th>
                <th className="py-4 px-6 text-center text-[#992787] font-semibold dark:text-purple-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedEvents.map((event, index) => {
                const originalIndex = startIndex + index;
                return (
                  <tr key={originalIndex} className="hover:bg-[#f9f4f9] dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-6 font-medium dark:text-gray-200">{event.eventCode}</td>
                    <td className="py-4 px-6 max-md:hidden dark:text-gray-300">{event.clientName}</td>
                    <td className="py-4 px-6 dark:text-gray-300">{event.eventType}</td>
                    <td className="py-4 px-6 max-lg:hidden dark:text-gray-300">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="py-4 px-6 text-center relative">
                      <div className="inline-block relative">
                        <button
                          onClick={() => handleDotClick(originalIndex)}
                          className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                        {activeDropdownIndex === originalIndex && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                            <div
                              onClick={() => updateStatus(originalIndex, 'Accepted')}
                              className="px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer flex items-center gap-2 text-green-600 dark:text-green-300"
                            >
                              <FiCheck className="w-5 h-5" />
                              Approve
                            </div>
                            <div
                              onClick={() => {
                                setSelectedEventIndex(originalIndex);
                                setShowRejectModal(true);
                                setActiveDropdownIndex(null);
                              }}
                              className="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-300"
                            >
                              <FiX className="w-5 h-5" />
                              Reject
                            </div>
                            <div
                              onClick={() => handleViewDetails(event)}
                              className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-2 text-blue-600 dark:text-blue-300"
                            >
                              <FiEye className="w-5 h-5" />
                              Details
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedEvents.map((event, index) => {
            const originalIndex = startIndex + index;
            return (
              <div key={originalIndex} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#992787] dark:text-purple-400">{event.eventCode}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.clientName}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#992787] dark:text-purple-400" />
                    <span className="dark:text-gray-300">{new Date(event.eventDate).toLocaleDateString()}</span>
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

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="text-[#992787] hover:text-[#7a1f6e] flex items-center gap-2 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <FiEye className="w-5 h-5" />
                    <span className="dark:text-gray-300">View Details</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => handleDotClick(originalIndex)}
                      className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <FiMoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdownIndex === originalIndex && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                        <div
                          onClick={() => updateStatus(originalIndex, 'Accepted')}
                          className="px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer flex items-center gap-2 text-green-600 dark:text-green-300"
                        >
                          <FiCheck className="w-5 h-5" />
                          Approve
                        </div>
                        <div
                          onClick={() => {
                            setSelectedEventIndex(originalIndex);
                            setShowRejectModal(true);
                            setActiveDropdownIndex(null);
                          }}
                          className="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-300"
                        >
                          <FiX className="w-5 h-5" />
                          Reject
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
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

      {/* Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-[#992787]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Event Details</h2>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Code</p>
                  <p className="font-medium dark:text-gray-200">{selectedEventDetails.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium dark:text-gray-200">{selectedEventDetails.clientName}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#992787] dark:text-purple-400" />
                  <span className="font-medium dark:text-gray-200">
                    {new Date(selectedEventDetails.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#992787] dark:text-purple-400" />
                  <span className="font-medium dark:text-gray-200">{selectedEventDetails.eventLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#992787] dark:text-purple-400" />
                  <span className="font-medium dark:text-gray-200">{selectedEventDetails.numberOfAttendees} attendees</span>
                </div>
                {selectedEventDetails.reason && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-300 font-medium">Rejection Reason:</p>
                    <p className="text-red-500 dark:text-red-400">{selectedEventDetails.reason}</p>
                  </div>
                )}
                {selectedEventDetails.additionalNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Additional Notes</p>
                    <p className="text-gray-700 dark:text-gray-300">{selectedEventDetails.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedEventIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reject Event</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Code</p>
                  <p className="font-medium dark:text-gray-200">{userEvents[selectedEventIndex]?.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium dark:text-gray-200">{userEvents[selectedEventIndex]?.clientName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Reason</label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#992787] dark:bg-gray-700 dark:text-gray-200"
                  placeholder="Provide detailed reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {rejectionReason.length}/500
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageApplications;