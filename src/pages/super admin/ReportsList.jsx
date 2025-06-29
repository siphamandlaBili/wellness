import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineDocumentText } from "react-icons/hi";

const ReportsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://wellness-backend-ntls.onrender.com/api/v1/events",
          { withCredentials: true }
        );
        setEvents(res.data.events || []);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#992787] mb-6 flex items-center gap-2">
        <HiOutlineDocumentText className="w-7 h-7" />
        Event Reports Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#992787]/10 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold">{events.length}</div>
          <div className="text-gray-700">Total Events</div>
        </div>
        {/* Add more cards for total users, nurses, etc. */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Assigned Nurse</th>
              <th className="px-4 py-2 text-left">Attendees</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-t">
                <td className="px-4 py-2">{event.eventName}</td>
                <td className="px-4 py-2">
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2">{event.eventLocation || "N/A"}</td>
                <td className="px-4 py-2">{event.status || "N/A"}</td>
                <td className="px-4 py-2">
                  {event.assignedNurse?.fullName || "Unassigned"}
                </td>
                <td className="px-4 py-2">{event.numberOfAttendees || 0}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/superadmin/reports/${event._id}`}
                    className="text-[#992787] underline"
                  >
                    View Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportsList;