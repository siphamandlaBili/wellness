import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import { FiMoreVertical, FiCheck, FiX, FiEye, FiGrid, FiList, FiInfo, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
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

  // Set initial view based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsTableView(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Accepted: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status] || 'bg-gray-100'}`}>
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
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787]"></div>
    </div>
  );

  if (!userEvents?.length) return (
    <div className="text-center p-8 text-gray-600">
      <div className="inline-block p-4 bg-[#992787]/10 rounded-full mb-4">
        <FiInfo className="text-3xl text-[#992787]" />
      </div>
      <p className="text-xl">No event applications found</p>
    </div>
  );

  return (
    <div className="container p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]">Event Applications</h1>
        <button
          onClick={() => setIsTableView(!isTableView)}
          className="p-2 text-[#992787] hover:bg-[#992787]/10 rounded-lg transition-colors"
          title={isTableView ? "Switch to Card View" : "Switch to Table View"}
        >
          {isTableView ? <FiGrid className="w-6 h-6" /> : <FiList className="w-6 h-6" />}
        </button>
      </div>

      {isTableView ? (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full bg-white">
            <thead className="bg-[#992787]/10">
              <tr>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold">Event Code</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold max-md:hidden">Company</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold">Type</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold max-lg:hidden">Date</th>
                <th className="py-4 px-6 text-left text-[#992787] font-semibold max-xl:hidden">Location</th>
                <th className="py-4 px-6 text-center text-[#992787] font-semibold">Attendees</th>
                <th className="py-4 px-6 text-center text-[#992787] font-semibold">Status</th>
                <th className="py-4 px-6 text-center text-[#992787] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userEvents.map((event, index) => (
                <tr key={index} className="hover:bg-[#f9f4f9] transition-colors">
                  <td className="py-4 px-6 font-medium">{event.eventCode}</td>
                  <td className="py-4 px-6 max-md:hidden">{event.clientName}</td>
                  <td className="py-4 px-6">{event.eventType}</td>
                  <td className="py-4 px-6 max-lg:hidden">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 max-xl:hidden">{event.eventLocation}</td>
                  <td className="py-4 px-6 text-center">{event.numberOfAttendees}</td>
                  <td className="py-4 px-6 text-center">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="py-4 px-6 text-center relative">
                    <div className="inline-block relative">
                      <button
                        onClick={() => handleDotClick(index)}
                        className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg"
                      >
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdownIndex === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                          <div
                            onClick={() => updateStatus(index, 'Accepted')}
                            className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-green-600"
                          >
                            <FiCheck className="w-5 h-5" />
                            Approve
                          </div>
                          <div
                            onClick={() => {
                              setSelectedEventIndex(index);
                              setShowRejectModal(true);
                              setActiveDropdownIndex(null);
                            }}
                            className="px-4 py-3 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-red-600"
                          >
                            <FiX className="w-5 h-5" />
                            Reject
                          </div>
                          <div
                            onClick={() => handleViewDetails(event)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-blue-600"
                          >
                            <FiEye className="w-5 h-5" />
                            Details
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userEvents.map((event, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#992787]">{event.eventCode}</h3>
                  <p className="text-sm text-gray-600">{event.clientName}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#992787]" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#992787]" />
                  <span>{event.eventLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#992787]" />
                  <span>{event.numberOfAttendees} attendees</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => handleViewDetails(event)}
                  className="text-[#992787] hover:text-[#7a1f6e] flex items-center gap-2"
                >
                  <FiEye className="w-5 h-5" />
                  View Details
                </button>
                <div className="relative">
                  <button
                    onClick={() => handleDotClick(index)}
                    className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg"
                  >
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                  {activeDropdownIndex === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                      <div
                        onClick={() => updateStatus(index, 'Accepted')}
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-green-600"
                      >
                        <FiCheck className="w-5 h-5" />
                        Approve
                      </div>
                      <div
                        onClick={() => {
                          setSelectedEventIndex(index);
                          setShowRejectModal(true);
                          setActiveDropdownIndex(null);
                        }}
                        className="px-4 py-3 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-red-600"
                      >
                        <FiX className="w-5 h-5" />
                        Reject
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-[#992787]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Event Code</p>
                  <p className="font-medium">{selectedEventDetails.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{selectedEventDetails.clientName}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#992787]" />
                  <span className="font-medium">
                    {new Date(selectedEventDetails.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#992787]" />
                  <span className="font-medium">{selectedEventDetails.eventLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#992787]" />
                  <span className="font-medium">{selectedEventDetails.numberOfAttendees} attendees</span>
                </div>
                {selectedEventDetails.reason && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Rejection Reason:</p>
                    <p className="text-red-500">{selectedEventDetails.reason}</p>
                  </div>
                )}
                {selectedEventDetails.additionalNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Additional Notes</p>
                    <p className="text-gray-700">{selectedEventDetails.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors"
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
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">Reject Event</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Event Code</p>
                  <p className="font-medium">{userEvents[selectedEventIndex]?.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{userEvents[selectedEventIndex]?.clientName}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Reason</label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#992787]"
                  placeholder="Provide detailed reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {rejectionReason.length}/500
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors"
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