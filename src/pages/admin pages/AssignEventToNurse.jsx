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
      icon: <HiOutlineMail className="text-purple-600 dark:text-purple-400" />,
    });
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl sm:text-3xl mb-6 font-bold text-center text-[#992787] dark:text-purple-400">
            Nurse Event Assignment
          </h2>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {nurses.map((nurse) => (
              <div key={nurse.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-row justify-center">
                      <HiOutlineUser className="w-5 h-5 text-[#992787] dark:text-purple-400 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{nurse.name}</span>
                    </div>
                    <div className="flex items-center">
                      {nurse.available ? (
                        <HiOutlineCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <HiOutlineXCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <HiOutlineMail className="w-5 h-5 text-[#992787] dark:text-purple-400 mr-2" />
                    <span>{nurse.email}</span>
                  </div>

                  <div className="relative">
                    <select
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 text-sm ${
                        nurse.available
                          ? 'border-purple-200 dark:border-purple-400/30 hover:border-purple-300 dark:hover:border-purple-400'
                          : 'border-gray-200 dark:border-gray-600'
                      } focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-400/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
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
                    <HiOutlineClipboardList className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 dark:text-purple-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-purple-50 dark:bg-purple-900/20">
                <tr>
                  <th className="p-3 sm:p-4 text-left text-sm font-medium text-[#992787] dark:text-purple-400">
                    <div className="flex items-center">
                      <HiOutlineUser className="w-5 h-5 mr-2" />
                      Nurse
                    </div>
                  </th>
                  <th className="p-3 sm:p-4 text-left text-sm font-medium text-[#992787] dark:text-purple-400">
                    <div className="flex items-center">
                      <HiOutlineMail className="w-5 h-5 mr-2" />
                      Email
                    </div>
                  </th>
                  <th className="p-3 sm:p-4 text-left text-sm font-medium text-[#992787] dark:text-purple-400">
                    <div className="flex items-center">
                      <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                      Status
                    </div>
                  </th>
                  <th className="p-3 sm:p-4 text-left text-sm font-medium text-[#992787] dark:text-purple-400">
                    <div className="flex items-center">
                      <HiOutlineClipboardList className="w-5 h-5 mr-2" />
                      Assign Event
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {nurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 sm:p-4 text-sm text-gray-700 dark:text-gray-100 font-medium">{nurse.name}</td>
                    <td className="p-3 sm:p-4 text-sm text-gray-600 dark:text-gray-300">{nurse.email}</td>
                    <td className="p-3 sm:p-4">
                      <div className="inline-flex items-center">
                        {nurse.available ? (
                          <>
                            <HiOutlineCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                            <span className="text-green-600 dark:text-green-400">Available</span>
                          </>
                        ) : (
                          <>
                            <HiOutlineXCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                            <span className="text-red-600 dark:text-red-400">Assigned</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="relative">
                        <select
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 text-sm ${
                            nurse.available
                              ? 'border-purple-200 dark:border-purple-400/30 hover:border-purple-300 dark:hover:border-purple-400'
                              : 'border-gray-200 dark:border-gray-600'
                          } focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-400/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
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
                        <HiOutlineClipboardList className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 dark:text-purple-300" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-300 flex flex-col sm:flex-row items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <HiOutlineInformationCircle className="w-5 h-5 mr-2 text-purple-400 mb-2 sm:mb-0" />
            <span className="text-center sm:text-left">
              Nurses will receive an email notification when assigned to events
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignEventToNurse;