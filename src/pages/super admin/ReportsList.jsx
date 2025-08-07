import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineDocumentText, HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineCalendar } from "react-icons/hi";

const ReportsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalUnassigned: 0,
    totalAccepted: 0,
    totalRejected: 0
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://wellness-backend-ntls.onrender.com/api/v1/events",
          { withCredentials: true }
        );
        const eventsData = res.data.events || [];
        setEvents(eventsData);
        
        // Calculate statistics
        const assignedCount = eventsData.filter(event => event.assignedNurse).length;
        const acceptedCount = eventsData.filter(event => event.status === 'Accepted').length;
        const rejectedCount = eventsData.filter(event => event.status === 'Rejected').length;
        
        setStats({
          totalAssigned: assignedCount,
          totalUnassigned: eventsData.length - assignedCount,
          totalAccepted: acceptedCount,
          totalRejected: rejectedCount
        });
      } catch (err) {
        setEvents([]);
        setStats({
          totalAssigned: 0,
          totalUnassigned: 0,
          totalAccepted: 0,
          totalRejected: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#992787] flex items-center gap-2">
          <HiOutlineDocumentText className="w-6 h-6" />
          Event Reports Overview
        </h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#992787]/10">
              <HiOutlineCalendar className="w-5 h-5 text-[#992787]" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Events</div>
              <div className="text-xl font-semibold">{events.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <HiOutlineUserGroup className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Assigned</div>
              <div className="text-xl font-semibold">{stats.totalAssigned}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <HiOutlineUserGroup className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Unassigned</div>
              <div className="text-xl font-semibold">{stats.totalUnassigned}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Accepted</div>
              <div className="text-xl font-semibold">{stats.totalAccepted}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <HiOutlineXCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Rejected</div>
              <div className="text-xl font-semibold">{stats.totalRejected}</div>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#992787]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Nurse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.eventName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-[150px] truncate" title={event.venue || "N/A"}>
                      {event.venue || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${event.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                        event.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {event.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.assignedNurse?.fullName || (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.numberOfAttendees || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/superadmin/reports/${event._id}`}
                      className="text-[#992787] hover:text-[#7a1f69] font-medium hover:underline"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No events found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsList;