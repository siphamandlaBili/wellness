import React, { useState, useEffect } from 'react';

const AcceptedEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch accepted events from an API or mock data
    const fetchAcceptedEvents = async () => {
      const mockData = [
        {
          id: 1,
          eventName: 'Health Camp',
          eventDate: '2025-04-15',
          eventLocation: 'Community Center',
          status: 'Accepted',
        },
        {
          id: 2,
          eventName: 'Blood Donation Drive',
          eventDate: '2025-04-20',
          eventLocation: 'City Hospital',
          status: 'Accepted',
        },
      ];
      setEvents(mockData.filter((event) => event.status === 'Accepted'));
    };

    fetchAcceptedEvents();
  }, []);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Accepted Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-purple-100 border-b">
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Event Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{event.eventName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{event.eventDate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{event.eventLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcceptedEvents;