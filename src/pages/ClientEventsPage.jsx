import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { assets } from '../assets/assets'; // Assuming you have assets for icons
import Navbar from '../components/Navbar';

const ClientEventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar for client panel */}
      <Navbar />

      {/* Main layout with sidebar and content */}
      <div className="flex items-start">
        {/* Left sidebar */}
        <div className="inline-block min-h-screen border-r-3 border-[#eeeeee] w-64 bg-white shadow-md">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            {['pending', 'approved'].map((status) => (
              <NavLink
                key={status}
                className={({ isActive }) =>
                  `relative flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive ? 'bg-[#f2d9eb] border-r-4 border-[#992787]' : ''}`
                }
                to={`/client-events/${status}`}
              >
                <img
                  className="min-w-4"
                  src={
                    status === 'pending'
                      ? assets.pending_icon
                      : assets.approved_icon
                  }
                  alt=""
                />
                <p className="max-sm:hidden">
                  {status === 'pending' ? 'Pending Events' : 'Approved Events'}
                </p>
              </NavLink>
            ))}
          </ul>
        </div>

        {/* Right-side content */}
        <div className="flex-1 p-5">
          {/* Here you can render event details dynamically based on selected status */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Event Requests</h2>

          {/* Assuming the events will be listed dynamically */}
          <div>
            {['Pending', 'Approved'].map((status) => (
              <div key={status} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {status} Requests (3) {/* Here, dynamically render the number of events */}
                </h3>
                <ul className="space-y-3">
                  {/* Mock data for event items */}
                  {['Event 1', 'Event 2', 'Event 3'].map((event, index) => (
                    <li
                      key={index}
                      className={`p-4 rounded-lg shadow-md ${
                        status === 'Pending'
                          ? 'bg-yellow-100 border-l-4 border-yellow-500'
                          : 'bg-green-100 border-l-4 border-green-500'
                      }`}
                    >
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEventsPage;
