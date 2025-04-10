import React from 'react';

const event = {
  id: "807f",
  eventCode: "VT-20250403-3017",
  clientName: "Aflumed health care",
  clientEmail: "azilebili@gmail.com",
  clientPhone: "0640986398",
  eventName: "spa day",
  eventType: "therapy",
  eventDate: "2025-04-25",
  eventLocation: "cape town",
  numberOfAttendees: "100",
  additionalNotes: "no notes",
  role: "user",
  status: "Accepted"
};

const NurseEvent = () => {
  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead className="bg-[#992787] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Event</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Type</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Attendees</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-700">
              <td className="py-2 px-4 border-b">{event.eventName}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">{event.eventType}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">{event.eventDate}</td>
              <td className="py-2 px-4 border-b">{event.eventLocation}</td>
              <td className="py-2 px-4 border-b max-sm:hidden">{event.numberOfAttendees}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded text-white text-sm ${event.status === 'Rejected' ? 'bg-red-500' : 'bg-green-500'}`}>
                  {event.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Client Info Section */}
        <div className="mt-6 bg-white border border-gray-200 rounded-md p-4 space-y-2 max-sm:text-sm">
          <h2 className="text-lg font-semibold text-[#992787] mb-2">Client Info</h2>
          <p><span className="font-semibold">Name:</span> {event.clientName}</p>
          <p><span className="font-semibold">Email:</span> {event.clientEmail}</p>
          <p><span className="font-semibold">Phone:</span> {event.clientPhone}</p>
          <p><span className="font-semibold">Event Code:</span> {event.eventCode}</p>
          <p><span className="font-semibold">Additional Notes:</span> {event.additionalNotes}</p>
        </div>
      </div>
    </div>
  );
};

export default NurseEvent;
