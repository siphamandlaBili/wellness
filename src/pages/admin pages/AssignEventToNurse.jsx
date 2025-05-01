import React, { useState, useEffect } from 'react';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineClipboardList,
  HiOutlineInformationCircle 
} from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignEventToNurse = () => {
  const [nurses, setNurses] = useState([
    { id: 1, name: 'Nurse 1', email: 'nurse1@example.com', available: true },
    { id: 2, name: 'Nurse 2', email: 'nurse2@example.com', available: true },
    { id: 3, name: 'Nurse 3', email: 'nurse3@example.com', available: true },
  ]);

  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const [assignedNurses, setAssignedNurses] = useState({});

  useEffect(() => {
    const fetchAcceptedEvents = async () => {
      const mockData = [
        {
          id: 1,
          eventCode: 'VT-20250403-5927',
          eventName: 'Health Camp',
          status: 'Accepted',
        },
        {
          id: 2,
          eventCode: 'VT-20250403-3017',
          eventName: 'Blood Donation Drive',
          status: 'Accepted',
        },
      ];
      setAcceptedEvents(mockData.filter((event) => event.status === 'Accepted'));
    };

    fetchAcceptedEvents();
  }, []);

  const handleAssignEvent = (nurseId, eventCode) => {
    setAssignedNurses((prev) => {
      const newState = { ...prev };
      if (eventCode === '') {
        delete newState[nurseId];
      } else {
        newState[nurseId] = eventCode;
      }
      return newState;
    });

    setNurses((prev) =>
      prev.map((nurse) =>
        nurse.id === nurseId 
          ? { ...nurse, available: eventCode === '' } 
          : nurse
      )
    );

    if (eventCode !== '') {
      const assignedNurse = nurses.find((nurse) => nurse.id === nurseId);
      const emailPayload = {
        to: assignedNurse.email,
        subject: 'Event Assignment',
        body: `You have been assigned to the event with code: ${eventCode}. Use this code to log in and manage the event.`,
      };
      sendEmail(emailPayload);
    }
  };

  const sendEmail = (payload) => {
    console.log('Sending email:', payload);
    toast.success(`Event details sent to ${payload.to}`, {
      icon: <HiOutlineMail className="text-[#992787] dark:text-purple-400" />,
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="container p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen">
        <div className=" dark:bg-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#2d3748] dark:text-gray-100">Nurse Event Assignment</h1>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {nurses.map((nurse) => (
              <div key={nurse.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <HiOutlineUser className="w-5 h-5 text-[#992787] dark:text-purple-400 mr-2" />
                      <span className="font-medium dark:text-gray-100">{nurse.name}</span>
                    </div>
                    {nurse.available ? (
                      <HiOutlineCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <HiOutlineXCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <HiOutlineMail className="w-5 h-5 text-[#992787] dark:text-purple-400 mr-2" />
                    <span>{nurse.email}</span>
                  </div>

                  <div className="relative">
                    <select
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                        nurse.available
                          ? 'border-[#992787]/20 dark:border-purple-400/30 hover:border-[#992787]/40'
                          : 'border-gray-200 dark:border-gray-600'
                      } focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                      value={assignedNurses[nurse.id] || ''}
                      onChange={(e) => handleAssignEvent(nurse.id, e.target.value)}
                    >
                      <option value="">Unassign</option>
                      {acceptedEvents.map((event) => (
                        <option 
                          key={event.id} 
                          value={event.eventCode}
                          className="dark:bg-gray-700"
                        >
                          {event.eventCode} - {event.eventName}
                        </option>
                      ))}
                    </select>
                    <HiOutlineClipboardList className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-[#992787]/10 dark:bg-purple-400/20">
                <tr>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">
                    <div className="flex items-center">
                      <HiOutlineUser className="w-5 h-5 mr-2" />
                      Nurse
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">
                    <div className="flex items-center">
                      <HiOutlineMail className="w-5 h-5 mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">
                    <div className="flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                      Status
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold">
                    <div className="flex items-center">
                      <HiOutlineClipboardList className="w-5 h-5 mr-2" />
                      Assign Event
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {nurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-[#f9f4f9] dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-6 font-medium dark:text-gray-100">{nurse.name}</td>
                    <td className="py-4 px-6 dark:text-gray-300">{nurse.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {nurse.available ? (
                          <>
                            <HiOutlineCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                            <span className="dark:text-gray-300">Available</span>
                          </>
                        ) : (
                          <>
                            <HiOutlineXCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                            <span className="dark:text-gray-300">Assigned</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <select
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                            nurse.available
                              ? 'border-[#992787]/20 dark:border-purple-400/30 hover:border-[#992787]/40'
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                          value={assignedNurses[nurse.id] || ''}
                          onChange={(e) => handleAssignEvent(nurse.id, e.target.value)}
                        >
                          <option value="">Unassign</option>
                          {acceptedEvents.map((event) => (
                            <option 
                              key={event.id} 
                              value={event.eventCode}
                              className="dark:bg-gray-700"
                            >
                              {event.eventCode} - {event.eventName}
                            </option>
                          ))}
                        </select>
                        <HiOutlineClipboardList className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-[#992787]/10 dark:bg-purple-400/20 rounded-lg text-center text-sm text-[#992787] dark:text-purple-300">
            <div className="flex items-center justify-center gap-2">
              <HiOutlineInformationCircle className="w-5 h-5" />
              <span>Nurses will receive an email notification when assigned to events</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignEventToNurse;