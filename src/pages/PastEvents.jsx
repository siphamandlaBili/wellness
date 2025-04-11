import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { 
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineX
} from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://wellness-temporary-db-2.onrender.com/events');
        const data = await response.json();
        const currentDate = new Date();
        
        const filteredEvents = data.filter(event => 
          new Date(event.eventDate) < currentDate
        );
        
        setPastEvents(filteredEvents);
      } catch (error) {
        toast.error('Failed to load events');
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
  const currentEvents = pastEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pastEvents.length / itemsPerPage);

  useEffect(() => {
    if (pastEvents.length > 0) {
      setCurrentPage(1);
    }
  }, [pastEvents]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <ToastContainer theme="colored" />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#992787] dark:text-purple-400">
          Past Events Archive
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#992787] dark:text-purple-300">{event.eventName}</h3>
                      <span className="text-sm bg-purple-100 dark:bg-purple-900/30 text-[#992787] dark:text-purple-300 px-3 py-1 rounded-full">
                        {event.eventCode}
                      </span>
                    </div>

                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <HiOutlineCalendar className="w-5 h-5 mr-2 text-[#992787] dark:text-purple-400" />
                        {moment(event.eventDate).format('MMMM Do YYYY')}
                      </div>
                      <div className="flex items-center">
                        <HiOutlineLocationMarker className="w-5 h-5 mr-2 text-[#992787] dark:text-purple-400" />
                        {event.eventLocation}
                      </div>
                      <div className="flex items-center">
                        <HiOutlineUserGroup className="w-5 h-5 mr-2 text-[#992787] dark:text-purple-400" />
                        {event.numberOfAttendees} attendees
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="mt-6 w-full py-2.5 text-[#992787] dark:text-purple-300 font-semibold rounded-lg border-2 border-[#992787] dark:border-purple-400 hover:border-purple-300 dark:hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <HiOutlineClipboardList className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-xl text-gray-500 dark:text-gray-400">No past events found</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pastEvents.length > 0 && (
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

        {/* Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-[#4644446c] dark:bg-[#000000cc] backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedEvent.eventName}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={<HiOutlineCalendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Date" value={moment(selectedEvent.eventDate).format('MMMM Do YYYY')} />
                  
                  <DetailItem icon={<HiOutlineLocationMarker className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Location" value={selectedEvent.eventLocation} />
                  
                  <DetailItem icon={<HiOutlineUserGroup className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Attendees" value={selectedEvent.numberOfAttendees} />
                  
                  <DetailItem icon={<HiOutlineUserCircle className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Client" value={selectedEvent.clientName} />
                  
                  <DetailItem icon={<HiOutlineMail className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Email" value={selectedEvent.clientEmail} />
                  
                  <DetailItem icon={<HiOutlinePhone className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                    label="Phone" value={selectedEvent.clientPhone} />
                </div>

                {selectedEvent.additionalNotes && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">Additional Notes</h4>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedEvent.additionalNotes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-purple-600 dark:bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="text-purple-500 dark:text-purple-400 pt-1">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-gray-700 dark:text-gray-200">{value || '-'}</div>
    </div>
  </div>
);

export default PastEvents;