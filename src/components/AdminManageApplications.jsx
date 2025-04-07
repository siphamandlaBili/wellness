import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import moment from 'moment';

const AdminManageApplications = () => {
  const { userEvents, setEventStorage, user } = useContext(AuthContext);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [status, setStatus] = useState('');
  
  // Fetch events from the backend
  const getEvent = async () => {
    const response = await fetch('http://localhost:5000/events');
    const data = await response.json();
    await setEventStorage(data);
  };

  // Update event status and PATCH to backend
  const updateStatus = async (index, newStatus) => {
    const event = userEvents[index];
    
    // PATCH request to update the status in the backend
    const response = await fetch(`http://localhost:5000/events/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }), // Send the updated status
    });

    if (response.ok) {
      // Update status locally in the state
      const updatedEvents = userEvents.map((event, i) =>
        i === index ? { ...event, status: newStatus } : event
      );
      console.log(updatedEvents);
      setEventStorage(updatedEvents); // Update the event list in context
      setActiveDropdownIndex(null); // Close the dropdown
    } else {
      console.error('Failed to update status');
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  // Handle dot click for dropdown menu
  const handleDotClick = (index) => {
    setActiveDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead className='bg-[#992787] text-white'>
            <tr>
              <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Company</th>
              <th className='py-2 px-4 text-left'>Event Type</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-center'>Attendies</th>
              <th className='py-2 px-4 text-left'>Status</th>
            </tr>
          </thead>

          <tbody>
            {userEvents?.map((event, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event?.eventCode}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event?.eventDate}</td>
                <td className='py-2 px-4 border-b'>{event?.eventType}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event?.eventDate}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event?.eventLocation}</td>
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
                            Accepted
                          </div>
                          <div
                            onClick={() => updateStatus(index, 'Rejected')}
                            className='px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600'
                          >
                            Rejected
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded font-medium ${
                        event.status === 'Accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {event.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageApplications;
