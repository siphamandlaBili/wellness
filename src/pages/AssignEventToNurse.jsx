import React, { useState, useEffect } from 'react';

const AssignEventToNurse = () => {
  const [nurses, setNurses] = useState([
    { id: 1, name: 'Nurse 1', email: 'nurse1@example.com', available: true },
    { id: 2, name: 'Nurse 2', email: 'nurse2@example.com', available: true },
    { id: 3, name: 'Nurse 3', email: 'nurse3@example.com', available: true },
  ]);

  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const [assignedNurses, setAssignedNurses] = useState({});

  useEffect(() => {
    // Fetch accepted events from an API or mock data
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
    // Update assigned nurses
    setAssignedNurses((prev) => ({
      ...prev,
      [nurseId]: eventCode,
    }));

    // Update nurse availability
    setNurses((prev) =>
      prev.map((nurse) =>
        nurse.id === nurseId ? { ...nurse, available: false } : nurse
      )
    );

    // Send event code to nurse's email
    const assignedNurse = nurses.find((nurse) => nurse.id === nurseId);
    const emailPayload = {
      to: assignedNurse.email,
      subject: 'Event Assignment',
      body: `You have been assigned to the event with code: ${eventCode}. Use this code to log in and manage the event.`,
    };
    sendEmail(emailPayload);
  };

  const sendEmail = (payload) => {
    console.log('Sending email:', payload);
    // Simulate email sending (replace with actual email API integration)
    alert(`Email sent to ${payload.to} with event code: ${payload.body}`);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Assign Event to Nurse</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-purple-100 border-b">
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Nurse Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Availability</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-purple-700">Assign Event</th>
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr key={nurse.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{nurse.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{nurse.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      nurse.available ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {nurse.available ? 'Available' : 'Assigned'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={assignedNurses[nurse.id] || ''}
                    onChange={(e) => handleAssignEvent(nurse.id, e.target.value)}
                    disabled={!nurse.available}
                  >
                    <option value="" disabled>
                      Select Event Code
                    </option>
                    {acceptedEvents.map((event) => (
                      <option key={event.id} value={event.eventCode}>
                        {event.eventCode}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignEventToNurse;