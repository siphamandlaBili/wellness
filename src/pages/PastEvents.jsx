import React, { useState, useEffect } from 'react';
import moment from 'moment';

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // To handle the selected event for modal

  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then((response) => response.json())
      .then((data) => {
        const currentDate = new Date();

        // Filter past events
        const filteredEvents = data.filter((event) => {
          const eventDate = new Date(event.eventDate);
          return eventDate < currentDate;
        });

        setPastEvents(filteredEvents); // Set filtered events to state
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  // Function to handle modal open
  const openModal = (event) => {
    setSelectedEvent(event);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className=" mx-auto p-6">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastEvents.length > 0 ? (
          pastEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-[rgb(153,39,135)]">{event.eventName}</h3>
              <p className="text-gray-600">Date: {moment(event.eventDate).format('MMMM Do YYYY')}</p>
              <p className="text-gray-600">Location: {event.eventLocation}</p>
              <p className="text-gray-600">Attendees: {event.numberOfAttendees}</p>

              <button
                onClick={() => openModal(event)}
                className="mt-4 text-[rgb(153,39,135)] hover:text-purple-500 font-semibold"
              >
                Show More
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No past events found.</p>
        )}
      </div>

      {/* Modal for event details */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2">
            <h3 className="text-2xl font-semibold text-[rgb(153,39,135)]">{selectedEvent.eventName}</h3>
            <p className="mt-2 text-gray-600"><strong>Date:</strong> {moment(selectedEvent.eventDate).format('MMMM Do YYYY')}</p>
            <p className="mt-2 text-gray-600"><strong>Location:</strong> {selectedEvent.eventLocation}</p>
            <p className="mt-2 text-gray-600"><strong>Attendees:</strong> {selectedEvent.numberOfAttendees}</p>
            <p className="mt-2 text-gray-600"><strong>Notes:</strong> {selectedEvent.additionalNotes}</p>
            <p className="mt-2 text-gray-600"><strong>Client Name:</strong> {selectedEvent.clientName}</p>
            <p className="mt-2 text-gray-600"><strong>Client Email:</strong> {selectedEvent.clientEmail}</p>
            <p className="mt-2 text-gray-600"><strong>Client Phone:</strong> {selectedEvent.clientPhone}</p>

            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 bg-[rgb(153,39,135)] text-white rounded-lg hover:bg-purple-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastEvents;
