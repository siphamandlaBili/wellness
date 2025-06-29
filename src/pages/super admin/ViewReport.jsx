import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewReport = ({ eventId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch report and view logs for this event
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://wellness-backend-ntls.onrender.com/api/v1/reports/event/${eventId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setReport(res.data.report);
        } else {
          toast.error("Failed to fetch report");
        }
      } catch (err) {
        toast.error("Error fetching report");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchReport();
  }, [eventId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-8">
      <ToastContainer position="top-right" />
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineDocumentText className="w-7 h-7 text-[#992787]" />
        <h2 className="text-2xl font-bold text-[#992787]">Event Report Access Log</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : report ? (
        <>
          {/* Event Details */}
          <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-bold text-[#992787] mb-4">Event Details</h3>
            <p className="text-gray-700">
              <strong>Event Name:</strong> {report.event?.eventName}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong>{" "}
              {report.event?.eventDate
                ? new Date(report.event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Venue:</strong> {report.event?.venue || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Company:</strong> {report.event?.company || "N/A"}
            </p>
          </div>

          {/* Access Log Table */}
          <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineUserGroup className="w-6 h-6 text-[#992787]" />
              <h3 className="text-xl font-bold text-[#992787]">Who Accessed This Report</h3>
            </div>
            {report.views && report.views.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Viewed At</th>
                      <th className="px-4 py-2 text-left">How</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.views.map((view, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">
                          {view.user?.fullName || view.user?.email || view.user || "Unknown"}
                        </td>
                        <td className="px-4 py-2 capitalize">{view.role || "Unknown"}</td>
                        <td className="px-4 py-2">
                          {view.viewedAt
                            ? new Date(view.viewedAt).toLocaleString()
                            : "Unknown"}
                        </td>
                        <td className="px-4 py-2">{view.method || "web"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">No access log for this report yet.</div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">No report found for this event.</div>
      )}
    </div>
  );
};

export default ViewReport;