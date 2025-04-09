import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { jsPDF } from 'jspdf';

const ManageApplications = () => {
  const { userEvents, setEventStorage, user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // Holds rejection reason or invoice details
  const [popupStyle, setPopupStyle] = useState(''); // Holds different styles for rejection vs invoice
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEvent = async () => {
    const response = await fetch('https://wellness-temporary-db-2.onrender.com/events');
    const data = await response.json();

    const ownedByUser = data.filter((event) => event.clientEmail === user.clientEmail);
    await setEventStorage(ownedByUser);
  };

  useEffect(() => {
    getEvent();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    const invoiceNo = selectedEvent ? `INV-${selectedEvent?.eventCode}`:""
    if (event.reason) {
      setPopupContent(event.reason); // If there's a rejection reason, show it
      setPopupStyle('rejection'); // Set the style for rejection
    } else {
      // Dummy invoice data for illustration
      const invoiceData = {
        invoiceNumber: invoiceNo,
        date: '2025-04-09',
        items: [
          { description: 'Event Planning', amount: 'R500' },
          { description: 'Venue Rental', amount: 'R1200' },
          { description: 'Catering', amount: 'R800' },
        ],
        total: 'R2500',
      };
      setPopupContent(invoiceData); // Set invoice data
      setPopupStyle(selectedEvent?.eventCode); // Set the style for invoice
    }

    setShowPopup(true); // Show the popup
  };

  const renderInvoice = (invoiceData) => {
    return (
      <div>
        <h4 className="text-lg font-semibold text-[#992787] mb-2">Invoice Details</h4>
        <p><strong>Invoice Number:</strong> {invoiceData.invoiceNumber}</p>
        <p><strong>Date:</strong> {invoiceData.date}</p>
        <div className="mt-4">
          <h5 className="text-md font-semibold text-[#992787]">Items:</h5>
          <ul>
            {invoiceData.items.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                <span>{item.description}</span>
                <span>{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-xl font-semibold text-[#992787]">
          <p><strong>Total:</strong> {invoiceData.total}</p>
        </div>
        <button
          onClick={() => downloadInvoice(invoiceData)}
          className="mt-4 px-4 py-2 bg-[#992787] text-white rounded"
        >
          Download PDF
        </button>
      </div>
    );
  };

  const downloadInvoice = (invoiceData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Invoice Details', 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${invoiceData.date}`, 20, 50);

    let yPosition = 60;
    doc.text('Items:', 20, yPosition);
    invoiceData.items.forEach((item, index) => {
      yPosition += 10;
      doc.text(`${item.description}: ${item.amount}`, 20, yPosition);
    });

    yPosition += 10;
    doc.text(`Total: ${invoiceData.total}`, 20, yPosition);

    doc.save(`${selectedEvent.eventCode}.pdf`);
  };

  const renderRejectionReason = (reason) => {
    return (
      <div>
        <h4 className="text-lg font-semibold text-red-600 mb-2">Rejection Reason</h4>
        <p>{reason}</p>
      </div>
    );
  };

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead className='bg-[#992787] text-white'>
            <tr>
              <th className='py-2 px-4 text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 text-left'>Event Type</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-center'>Attendees</th>
              <th className='py-2 px-4 text-left'>Status</th>
              <th className='py-2 px-4 text-left'>Details</th>
            </tr>
          </thead>
          
          <tbody>
            {userEvents?.map((event, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventCode}</td>
                <td className='py-2 px-4 border-b'>{event.eventType}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventDate}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{event.eventLocation}</td>
                <td className='py-2 px-4 border-b text-center'>{event.numberOfAttendees}</td>
                <td className='py-2 px-4 border-b text-center'>
                  {event.status ? event.status : "No status"}
                </td>
                <td className='py-2 link px-4 border-b max-sm:hidden'>
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#211e1e79] z-50">
          <div className={`bg-white w-[65vw] p-6 rounded-lg shadow-lg border-2 border-[#992787] ${popupStyle === 'rejection' ? 'bg-red-100' : 'bg-white'}`}>
            <h2 className="text-xl font-bold text-[#992787] mb-4">Event Details</h2>
            <p className="mb-2">
              <strong className="text-[#992787]">Event Code:</strong> {selectedEvent.eventCode}
            </p>
            <p className="mb-4">
              <strong className="text-[#992787]">Company Name:</strong> {selectedEvent.clientName}
            </p>
            <div>
              {popupStyle === 'rejection' ? renderRejectionReason(popupContent) : renderInvoice(popupContent)}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
