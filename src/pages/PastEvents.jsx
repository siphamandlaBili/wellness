import React, { useState } from 'react';
import moment from 'moment';
import { manageJobsData } from '../assets/assets';  // Assuming the data is in this file

const PastEvents = () => {
    // Get current timestamp
    const currentDate = moment().valueOf();

    // Filter events that have already passed
    const pastEvents = manageJobsData.filter(event => event.eventDate < currentDate);

    return (
        <div className="container p-4 max-w-5xl">
            <h2 className="text-xl font-bold mb-4">Past Events</h2>

            {/* Check if there are any past events */}
            {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {pastEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No past events found.</p>
            )}
        </div>
    );
};

// EventCard component
const EventCard = ({ event }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleToggleDetails = () => {
        setShowDetails(prevState => !prevState);
    };

    return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-[#992787]">{event.eventName}</h3>
            <p className="text-gray-700">Location: {event.eventLocation}</p>
            <p className="text-gray-700">Date: {moment(event.eventDate).format('MMMM Do YYYY')}</p>
            <p className="text-gray-700">Attendees: {event.numberOfAttendees}</p>

            {/* Toggle Button */}
            <button
                onClick={handleToggleDetails}
                className="mt-4 text-[#992787] underline"
            >
                {showDetails ? 'Show Less' : 'Show More'}
            </button>

            {/* Detailed info (conditional rendering) */}
            {showDetails && (
                <div className="mt-4 text-gray-700">
                    <p><strong>Client:</strong> {event.clientName}</p>
                    <p><strong>Client Email:</strong> {event.clientEmail}</p>
                    <p><strong>Client Phone:</strong> {event.clientPhone}</p>
                    <p><strong>Notes:</strong> {event.additionalNotes}</p>
                </div>
            )}
        </div>
    );
};

export default PastEvents;
