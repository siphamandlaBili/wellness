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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#992787]">
          Past Events Archive
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#992787]">{event.eventName}</h3>
                    <span className="text-sm bg-purple-100 text-[#992787] px-3 py-1 rounded-full">
                      {event.eventCode}
                    </span>
                  </div>

                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-center">
                      <HiOutlineCalendar className="w-5 h-5 mr-2 text-[#992787]" />
                      {moment(event.eventDate).format('MMMM Do YYYY')}
                    </div>
                    <div className="flex items-center">
                      <HiOutlineLocationMarker className="w-5 h-5 mr-2 text-[#992787]" />
                      {event.eventLocation}
                    </div>
                    <div className="flex items-center">
                      <HiOutlineUserGroup className="w-5 h-5 mr-2 text-[#992787]" />
                      {event.numberOfAttendees} attendees
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-6 w-full py-2.5 text-[#992787] font-semibold rounded-lg border-2 border-[#992787] hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <HiOutlineClipboardList className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-500">No past events found</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-purple-600">{selectedEvent.eventName}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={<HiOutlineCalendar className="w-5 h-5" />}
                    label="Date" value={moment(selectedEvent.eventDate).format('MMMM Do YYYY')} />
                  
                  <DetailItem icon={<HiOutlineLocationMarker className="w-5 h-5" />}
                    label="Location" value={selectedEvent.eventLocation} />
                  
                  <DetailItem icon={<HiOutlineUserGroup className="w-5 h-5" />}
                    label="Attendees" value={selectedEvent.numberOfAttendees} />
                  
                  <DetailItem icon={<HiOutlineUserCircle className="w-5 h-5" />}
                    label="Client" value={selectedEvent.clientName} />
                  
                  <DetailItem icon={<HiOutlineMail className="w-5 h-5" />}
                    label="Email" value={selectedEvent.clientEmail} />
                  
                  <DetailItem icon={<HiOutlinePhone className="w-5 h-5" />}
                    label="Phone" value={selectedEvent.clientPhone} />
                </div>

                {selectedEvent.additionalNotes && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-purple-600 mb-2">Additional Notes</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedEvent.additionalNotes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
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
    <div className="text-purple-500 pt-1">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-gray-700">{value || '-'}</div>
    </div>
  </div>
);

export default PastEvents;