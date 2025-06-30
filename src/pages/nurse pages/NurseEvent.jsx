import React from 'react';
import { 
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import { HiOutlineUser } from 'react-icons/hi2';
import { useNurseEvent } from '../../../context/NurseEventContext';

const NurseEvent = () => {
  const { eventData, isLoading, error } = useNurseEvent();
  console.log(eventData)
  if (isLoading) {
    return (
      <div className="max-w-[100vw] mx-auto p-6 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[100vw] mx-auto p-6 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="max-w-[100vw] mx-auto p-6 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">No upcoming events found</div>
      </div>
    );
  }

  return (
    <div className="max-w-[100vw] mx-auto p-6 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Event Header */}
        <div className="bg-gradient-to-r from-[#992787] to-[#6a1b5e] dark:from-purple-900 dark:to-purple-800 p-6">
          <h1 className="text-3xl font-bold text-white dark:text-purple-100">{eventData.eventName}</h1>
          <p className="text-white/90 dark:text-purple-200 mt-2">{eventData.eventCode}</p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="flex items-center space-x-3">
            <HiOutlineCalendar className="w-6 h-6 text-[#992787] dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="font-medium dark:text-gray-100">
                {new Date(eventData.eventDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <HiOutlineLocationMarker className="w-6 h-6 text-[#992787] dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium dark:text-gray-100">{eventData.eventLocation}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineUserGroup className="w-6 h-6 text-[#992787] dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Attendees</p>
              <p className="font-medium dark:text-gray-100">{eventData.numberOfAttendees}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineClipboardList className="w-6 h-6 text-[#992787] dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                eventData.status === 'Accepted' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
              }`}>
                {eventData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information Section */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6 space-x-2">
            <HiOutlineInformationCircle className="w-6 h-6 text-[#992787] dark:text-purple-400" />
            <h2 className="text-xl font-semibold dark:text-gray-100">Client Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <HiOutlineUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium dark:text-gray-100">{eventData.clientName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HiOutlineMail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium break-all dark:text-gray-100">{eventData.clientEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HiOutlinePhone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium dark:text-gray-100">{eventData.clientPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Additional Notes</p>
              <p className="text-gray-700 dark:text-gray-200">
                {eventData.additionalNotes || 'No additional notes provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseEvent;