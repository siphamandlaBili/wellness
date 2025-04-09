import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminManageApplications = () => {
  const { userEvents, setEventStorage } = useContext(AuthContext);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  const getEvent = async () => {
    const response = await fetch('https://wellness-temporary-db-2.onrender.com/events');
    const data = await response.json();
    setEventStorage(data);
  };

  const updateStatus = async (index, newStatus, reason = '') => {
    const event = userEvents[index];
    const bodyData = { status: newStatus };
    if (reason) bodyData.reason = reason;

    const response = await fetch(`https://wellness-temporary-db-2.onrender.com/events/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      const updatedEvents = userEvents.map((e, i) =>
        i === index ? { ...e, status: newStatus, reason } : e
      );
      setEventStorage(updatedEvents);
      setActiveDropdownIndex(null);
      setShowRejectModal(false);
      setRejectionReason('');

      if (newStatus === 'Accepted') {
        toast.success('Event accepted. Client has been notified.');
      } else if (newStatus === 'Rejected') {
        toast.info('Event rejected. Reason submitted.');
      }
    } else {
      toast.error('Failed to update event status.');
    }
  };

  const handleReject = (index) => {
    setSelectedEventIndex(index);
    setShowRejectModal(true);
    setActiveDropdownIndex(null);
  };

  const handleRejectSubmit = () => {
    if (selectedEventIndex !== null && rejectionReason.trim() !== '') {
      updateStatus(selectedEventIndex, 'Rejected', rejectionReason);
    } else {
      toast.warning('Please provide a reason for rejection.');
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  const handleDotClick = (index) => {
    setActiveDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className='container p-4 max-w-5xl'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead className='bg-[#992787] text-white'>
            <tr>
              <th className='py-2 px-4 text-left'>Event Code</th>
              <th className='py-2 px-4 text-left'>Company</th>
              <th className='py-2 px-4 text-left'>Event Type</th>
              <th className='py-2 px-4 text-left'>Date</th>
              <th className='py-2 px-4 text-left'>Location</th>
              <th className='py-2 px-4 text-center'>Attendees</th>
              <th className='py-2 px-4 text-left'>Status</th>
            </tr>
          </thead>

          <tbody>
            {userEvents?.map((event, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b'>{event?.eventCode}</td>
                <td className='py-2 px-4 border-b'>{event?.clientName}</td>
                <td className='py-2 px-4 border-b'>{event?.eventType}</td>
                <td className='py-2 px-4 border-b'>{event?.eventDate}</td>
                <td className='py-2 px-4 border-b'>{event?.eventLocation}</td>
                <td className='py-2 px-4 border-b text-center'>{event?.numberOfAttendees}</td>
                <td className='py-2 px-4 border-b text-center relative'>
                  {!event?.status ? (
                    <div className='inline-block relative'>
                      <button
                        onClick={() => handleDotClick(index)}
                        className='text-xl font-bold'
                      >
                        ⋯
                      </button>

                      {activeDropdownIndex === index && (
                        <div className='absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10'>
                          <div
                            onClick={() => updateStatus(index, 'Accepted')}
                            className='px-4 py-2 hover:bg-green-100 cursor-pointer text-green-600'
                          >
                            Accept
                          </div>
                          <div
                            onClick={() => handleReject(index)}
                            className='px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600'
                          >
                            Reject
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          event.status === 'Accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {event.status}
                      </span>
                      
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedEventIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#211e1e79] z-50">
          <div className="bg-white w-[65vw] p-6 rounded-lg shadow-lg border-2 border-[#992787]">
            <h2 className="text-xl font-bold text-[#992787] mb-4">Reject Event</h2>
            <p className="mb-2">
              <strong className="text-[#992787]">Event Code:</strong> {userEvents[selectedEventIndex]?.eventCode}
            </p>
            <p className="mb-4">
              <strong className="text-[#992787]">Company Name:</strong> {userEvents[selectedEventIndex]?.clientName}
            </p>
            <textarea
              rows="4"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-[#992787] text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageApplications;
