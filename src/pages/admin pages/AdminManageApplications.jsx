import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { 
  FiMoreVertical, FiCheck, FiX, FiEye, FiGrid, FiList, 
  FiInfo, FiCalendar, FiMapPin, FiUsers, FiChevronLeft, 
  FiChevronRight, FiPlus, FiTrash, FiDollarSign, FiMail, 
  FiPhone, FiUser, FiType, FiClipboard, FiPackage 
} from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const CACHE_KEY = 'adminEventsCache';
const CACHE_DURATION = 6 * 60 * 1000; // 6 minutes

const AdminManageApplications = () => {
  const [eventStorage, setEventStorage] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTableView, setIsTableView] = useState(true);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const Backend= import.meta.env.VITE_BACKEND_URL;
  // Cache functions
  const getCachedEvents = () => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    const { data, timestamp } = JSON.parse(cache);
    return Date.now() - timestamp < CACHE_DURATION ? data : null;
  };

  const setCachedEvents = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  // Responsive view handling
  useEffect(() => {
    const handleResize = () => setIsTableView(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch events with cache
  const getEvents = async () => {
    const cached = getCachedEvents();
    if (cached) {
      setEventStorage(cached);
      setLoading(false);
    }

    try {
      if (!cached) setLoading(true);
      const { data } = await axios.get(
        `${Backend}/api/v1/events`,
        { withCredentials: true }
      );
      setCachedEvents(data.events);
      setEventStorage(data.events);
    } catch (error) {
      toast.error('Failed to load events');
      if (!cached) setEventStorage([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle rejection
  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim() || selectedEventIndex === null) return;

    try {
      const event = eventStorage[selectedEventIndex];
      const { data } = await axios.put(
        `${Backend}/api/v1/events/${event._id}`,
        { 
          status: 'Rejected',
          reason: rejectionReason 
        },
        { withCredentials: true }
      );

      const updatedEvents = [...eventStorage];
      updatedEvents[selectedEventIndex] = data.event;
      
      setEventStorage(updatedEvents);
      setCachedEvents(updatedEvents);
      setShowRejectModal(false);
      setRejectionReason('');
      toast.success('Event rejected successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Rejection failed. Please try again.');
    }
  };

  // Handle invoice submission
  const handleInvoiceSubmit = async () => {
    if (invoiceItems.some(item => !item.description || !item.amount)) {
      toast.error('Please fill in all invoice fields');
      return;
    }

    try {
      const event = eventStorage[selectedEventIndex];
      const { data } = await axios.put(
        `${Backend}/api/v1/events/${event._id}`,
        { 
          status: 'Accepted',
          invoiceItems: invoiceItems.filter(item => item.description && item.amount)
        },
        { withCredentials: true }
      );

      const updatedEvents = [...eventStorage];
      updatedEvents[selectedEventIndex] = data.event;
      
      setEventStorage(updatedEvents);
      setCachedEvents(updatedEvents);
      setShowInvoiceForm(false);
      setInvoiceItems([]);
      toast.success('Event approved with invoice details');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save invoice details');
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = eventStorage?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(eventStorage?.length / itemsPerPage);

  useEffect(() => { getEvents(); }, []);

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm ${
      status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
      status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }`}>
      {status || "Pending"}
    </span>
  );

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', amount: '' }]);
  };

  const removeInvoiceItem = (index) => {
    if (invoiceItems?.length === 1) return;
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
  };

  const handleViewDetails = (eventId) => {
    const event = eventStorage.find(e => e._id === eventId);
    setSelectedEventDetails(event);
  };

  // Pre-populate invoice items when opening invoice form
  const handleApproveClick = (originalIndex) => {
    const event = eventStorage[originalIndex];
    
    // Create initial invoice items from medical professionals needed
    const initialItems = event.medicalProfessionalsNeeded?.map(prof => ({
      description: prof,
      amount: ''
    })) || [];
    
    // Add at least one empty item if no professionals are specified
    if (initialItems.length === 0) {
      initialItems.push({ description: '', amount: '' });
    }
    
    setInvoiceItems(initialItems);
    setSelectedEventIndex(originalIndex);
    setShowInvoiceForm(true);
    setActiveDropdownIndex(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787] dark:border-purple-400"></div>
    </div>
  );

  if (eventStorage?.length === 0) return (
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
              {paginatedEvents?.map((event, index) => {
                const originalIndex = startIndex + index;
                return (
                  <tr key={event._id} className="hover:bg-[#f9f4f9] dark:hover:bg-gray-700 transition-colors">
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
                          onClick={() => setActiveDropdownIndex(activeDropdownIndex === originalIndex ? null : originalIndex)}
                          className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          <FiMoreVertical className="w-5 h-5" />
                        </button>
                        {activeDropdownIndex === originalIndex && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                            <div
                              onClick={() => handleApproveClick(originalIndex)}
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
                              onClick={() => handleViewDetails(event._id)}
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
          {paginatedEvents?.map((event, index) => {
            const originalIndex = startIndex + index;
            return (
              <div key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
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
                    <span className="dark:text-gray-300">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-[#992787] dark:text-purple-400" />
                    <span className="dark:text-gray-300">{event.numberOfAttendees} attendees</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <button
                    onClick={() => handleViewDetails(event._id)}
                    className="text-[#992787] hover:text-[#7a1f6e] flex items-center gap-2 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <FiEye className="w-5 h-5" />
                    <span className="dark:text-gray-300">View Details</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdownIndex(activeDropdownIndex === originalIndex ? null : originalIndex)}
                      className="text-[#992787] hover:text-[#7a1f6e] p-2 rounded-lg dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <FiMoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdownIndex === originalIndex && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                        <div
                          onClick={() => handleApproveClick(originalIndex)}
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

      {/* Enhanced Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-[#992787]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Event Application Details
              </h2>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem 
                  icon={<FiType className="text-[#992787] dark:text-purple-400" />}
                  label="Event Code"
                  value={selectedEventDetails.eventCode}
                />
                <DetailItem 
                  icon={<FiUser className="text-[#992787] dark:text-purple-400" />}
                  label="Client Name"
                  value={selectedEventDetails.clientName}
                />
                <DetailItem 
                  icon={<FiMail className="text-[#992787] dark:text-purple-400" />}
                  label="Client Email"
                  value={selectedEventDetails.clientEmail}
                />
                <DetailItem 
                  icon={<FiPhone className="text-[#992787] dark:text-purple-400" />}
                  label="Client Phone"
                  value={selectedEventDetails.clientPhone}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem 
                  icon={<FiClipboard className="text-[#992787] dark:text-purple-400" />}
                  label="Event Name"
                  value={selectedEventDetails.eventName}
                />
                <DetailItem 
                  icon={<FiPackage className="text-[#992787] dark:text-purple-400" />}
                  label="Event Type"
                  value={selectedEventDetails.eventType}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem 
                  icon={<FiCalendar className="text-[#992787] dark:text-purple-400" />}
                  label="Event Date"
                  value={new Date(selectedEventDetails.eventDate).toLocaleDateString()}
                />
                <DetailItem 
                  icon={<FiMapPin className="text-[#992787] dark:text-purple-400" />}
                  label="Venue"
                  value={selectedEventDetails.venue}
                />
                <DetailItem 
                  icon={<FiUsers className="text-[#992787] dark:text-purple-400" />}
                  label="Attendees"
                  value={selectedEventDetails.numberOfAttendees}
                />
              </div>
              
              {/* Medical Professionals */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FiUser className="text-[#992787] dark:text-purple-400" />
                  Medical Professionals Needed
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEventDetails.medicalProfessionalsNeeded?.map((prof, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      {prof}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Additional Notes */}
              {selectedEventDetails.additionalNotes && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FiClipboard className="text-[#992787] dark:text-purple-400" />
                    Additional Notes
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                    {selectedEventDetails.additionalNotes}
                  </p>
                </div>
              )}
              
              {/* Status Information */}
              <div className={`p-4 rounded-lg ${
                selectedEventDetails.status === 'Rejected' ? 
                  'bg-red-50 dark:bg-red-900/20' : 
                selectedEventDetails.status === 'Accepted' ? 
                  'bg-green-50 dark:bg-green-900/20' : 
                  'bg-yellow-50 dark:bg-yellow-900/20'
              }`}>
                <h3 className="font-medium flex items-center gap-2 ${
                  selectedEventDetails.status === 'Rejected' ? 
                    'text-red-700 dark:text-red-300' : 
                  selectedEventDetails.status === 'Accepted' ? 
                    'text-green-700 dark:text-green-300' : 
                    'text-yellow-700 dark:text-yellow-300'
                }">
                  <FiInfo className="text-lg" />
                  Status: {selectedEventDetails.status || "Pending"}
                </h3>
                
                {selectedEventDetails.reason && (
                  <div className="mt-2">
                    <p className="font-medium text-red-700 dark:text-red-300">Rejection Reason:</p>
                    <p className="text-red-600 dark:text-red-400">{selectedEventDetails.reason}</p>
                  </div>
                )}
                
                {selectedEventDetails.invoiceItems?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-green-700 dark:text-green-300">Invoice Items:</p>
                    <div className="mt-2 space-y-2">
                      {selectedEventDetails.invoiceItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                          <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            R{parseFloat(item.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Close Details
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
                  <p className="font-medium dark:text-gray-200">{eventStorage[selectedEventIndex]?.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium dark:text-gray-200">{eventStorage[selectedEventIndex]?.clientName}</p>
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
                  {rejectionReason?.length}/500
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

      {/* Enhanced Invoice Form Modal */}
      {showInvoiceForm && selectedEventIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-4 p-6 rounded-2xl shadow-2xl border-l-4 border-[#992787]">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create Invoice</h2>
              <button
                onClick={() => setShowInvoiceForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Code</p>
                  <p className="font-medium dark:text-gray-200">{eventStorage[selectedEventIndex]?.eventCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium dark:text-gray-200">{eventStorage[selectedEventIndex]?.clientName}</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FiUser className="text-[#992787] dark:text-purple-400" />
                  Medical Professionals Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {eventStorage[selectedEventIndex]?.medicalProfessionalsNeeded?.map((prof, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      {prof}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiDollarSign className="text-[#992787] dark:text-purple-400" />
                  Invoice Items
                </h3>
                
                {invoiceItems?.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[index].description = e.target.value;
                          setInvoiceItems(newItems);
                        }}
                        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                        placeholder="Service description"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Amount (R)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newItems = [...invoiceItems];
                            newItems[index].amount = e.target.value;
                            setInvoiceItems(newItems);
                          }}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Amount"
                          min="0"
                          step="0.01"
                        />
                        {invoiceItems?.length > 1 && (
                          <button
                            onClick={() => removeInvoiceItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <FiTrash className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addInvoiceItem}
                  className="w-full py-2 text-[#992787] dark:text-purple-400 hover:bg-[#992787]/10 dark:hover:bg-purple-400/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  Add Another Item
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowInvoiceForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleInvoiceSubmit}
                className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                <FiCheck className="w-5 h-5" />
                Save Invoice & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable detail item component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium dark:text-gray-200">{value || 'N/A'}</p>
    </div>
  </div>
);

export default AdminManageApplications;