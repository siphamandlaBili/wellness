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

const event = {
  id: "807f",
  eventCode: "VT-20250403-3017",
  clientName: "Aflumed health care",
  clientEmail: "azilebili@gmail.com"
  ,
  clientPhone: "0640986398",
  eventName: "Spa Day",
  eventType: "Therapy",
  eventDate: "2025-04-25",
  eventLocation: "Cape Town",
  numberOfAttendees: "100",
  additionalNotes: "No notes provided",
  role: "user",
  status: "Accepted",
  additionalNotes: "prepare masks and gloves for all the ettendies as there is going to be in a small room and want to avoid contaminationd",
};

const NurseEvent = () => {
  return (
    <div className="max-w-[100vw] mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Event Header */}
        <div className="bg-gradient-to-r from-[#992787] to-[#6a1b5e] p-6">
          <h1 className="text-3xl font-bold text-white">{event.eventName}</h1>
          <p className="text-white/90 mt-2">{event.eventCode}</p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="flex items-center space-x-3">
            <HiOutlineCalendar className="w-6 h-6 text-[#992787]" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <HiOutlineLocationMarker className="w-6 h-6 text-[#992787]" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{event.eventLocation}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineUserGroup className="w-6 h-6 text-[#992787]" />
            <div>
              <p className="text-sm text-gray-500">Attendees</p>
              <p className="font-medium">{event.numberOfAttendees}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HiOutlineClipboardList className="w-6 h-6 text-[#992787]" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === 'Accepted' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client Information Section */}
        <div className="border-t border-gray-100 p-6">
          <div className="flex items-center mb-6 space-x-2">
            <HiOutlineInformationCircle className="w-6 h-6 text-[#992787]" />
            <h2 className="text-xl font-semibold">Client Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <HiOutlineUser className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{event.clientName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HiOutlineMail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium break-all">{event.clientEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <HiOutlinePhone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{event.clientPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Additional Notes</p>
              <p className="text-gray-700">{event.additionalNotes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseEvent;