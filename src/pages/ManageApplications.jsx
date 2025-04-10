import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { jsPDF } from "jspdf";
import { 
  FiEye, 
  FiXCircle, 
  FiFileText, 
  FiAlertCircle, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiDownload 
} from 'react-icons/fi';

const ManageApplications = () => {
  const { userEvents, setEventStorage, user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupStyle, setPopupStyle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTableView, setIsTableView] = useState(true);

  const getEvent = async () => {
    try {
      const response = await fetch('https://wellness-temporary-db-2.onrender.com/events');
      const data = await response.json();
      const ownedByUser = data.filter((event) => event.clientEmail === user.clientEmail);
      setEventStorage(ownedByUser);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    if (event.status) {
      if (event.reason) {
        setPopupContent(event.reason);
        setPopupStyle('rejection');
      } else {
        const invoiceData = {
          invoiceNumber: 'INV-12345',
          date: '2025-04-09',
          items: [
            { description: 'Event Planning', amount: 'R500' },
            { description: 'Venue Rental', amount: 'R1200' },
            { description: 'Catering', amount: 'R800' },
          ],
          total: 'R2500',
        };
        setPopupContent(invoiceData);
        setPopupStyle('invoice');
      }
    } else {
      setPopupContent('No details available yet, our team will get back to you shortly');
      setPopupStyle('no-status');
    }
    setShowPopup(true);
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status?.toLowerCase()] || 'bg-gray-100'}`}>
        {status || "Pending"}
      </span>
    );
  };

  const TableView = () => (
    <div className='overflow-x-auto rounded-xl shadow-lg border border-gray-100'>
      <table className='min-w-full bg-white'>
        <thead className='bg-[#992787]/10'>
          <tr>
            <th className='py-4 px-6 text-left text-[#992787] font-semibold'>Event Code</th>
            <th className='py-4 px-6 text-left text-[#992787] font-semibold'>Type</th>
            <th className='py-4 px-6 text-left text-[#992787] font-semibold max-md:hidden'>Date</th>
            <th className='py-4 px-6 text-left text-[#992787] font-semibold max-lg:hidden'>Location</th>
            <th className='py-4 px-6 text-center text-[#992787] font-semibold'>Attendees</th>
            <th className='py-4 px-6 text-center text-[#992787] font-semibold'>Status</th>
            <th className='py-4 px-6 text-center text-[#992787] font-semibold'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {userEvents?.map((event, index) => (
            <tr key={index} className='hover:bg-[#f9f4f9] transition-colors'>
              <td className='py-4 px-6 font-medium'>{event.eventCode}</td>
              <td className='py-4 px-6'>{event.eventType}</td>
              <td className='py-4 px-6 max-md:hidden'>{event.eventDate}</td>
              <td className='py-4 px-6 max-lg:hidden'>{event.eventLocation}</td>
              <td className='py-4 px-6 text-center'>{event.numberOfAttendees}</td>
              <td className='py-4 px-6 text-center'><StatusBadge status={event.status} /></td>
              <td className='py-4 px-6 text-center'>
                <button
                  onClick={() => handleViewDetails(event)}
                  className="text-[#992787] hover:text-[#7a1f6e] transition-colors"
                >
                  <FiEye className="inline-block mr-2" />View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userEvents?.map((event, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#992787] font-semibold">{event.eventCode}</span>
            <StatusBadge status={event.status} />
          </div>
          <h3 className="text-xl font-semibold mb-2">{event.eventType}</h3>
          <div className="space-y-2 text-gray-600">
            <p><FiCalendar className="inline mr-2" />{event.eventDate}</p>
            <p><FiMapPin className="inline mr-2" />{event.eventLocation}</p>
            <p><FiUsers className="inline mr-2" />{event.numberOfAttendees} attendees</p>
          </div>
          <button
            onClick={() => handleViewDetails(event)}
            className="mt-4 w-full py-2 text-[#992787] hover:bg-[#992787]/10 rounded-lg transition-colors"
          >
            <FiEye className="inline-block mr-2" />View Details
          </button>
        </div>
      ))}
    </div>
  );

  const renderInvoice = (invoiceData) => {
    const generatePDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Invoice Details', 14, 20);
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 14, 30);
      doc.text(`Date: ${invoiceData.date}`, 14, 40);
      doc.text('Items:', 14, 50);
      let yOffset = 60;
      invoiceData.items.forEach(item => {
        doc.text(`${item.description}: ${item.amount}`, 14, yOffset);
        yOffset += 10;
      });
      doc.text(`Total: ${invoiceData.total}`, 14, yOffset);
      doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Invoice Number</label>
            <p className="font-medium">{invoiceData.invoiceNumber}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Date</label>
            <p className="font-medium">{invoiceData.date}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h5 className="text-sm font-semibold text-gray-500 mb-2">Items</h5>
          <div className="space-y-3">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span>{item.description}</span>
                <span className="font-medium">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="font-semibold">Total Amount:</span>
          <span className="text-xl font-bold text-[#992787]">{invoiceData.total}</span>
        </div>

        <button
          onClick={generatePDF}
          className="w-full mt-6 px-6 py-3 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors flex items-center justify-center gap-2"
        >
          <FiDownload className="w-5 h-5" />
          Download Invoice
        </button>
      </div>
    );
  };

  return (
    <div className='container p-6 max-w-7xl mx-auto'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2d3748]">Event Applications</h1>
        <button
          onClick={() => setIsTableView(!isTableView)}
          className="p-2 text-[#992787] hover:bg-[#992787]/10 rounded-lg transition-colors"
          title={isTableView ? "Switch to Card View" : "Switch to Table View"}
        >
          <FiEye className="w-6 h-6" />
        </button>
      </div>

      {isTableView ? <TableView /> : <CardView />}

      {showPopup && selectedEvent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className={`bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl flex flex-col ${
      popupStyle === 'rejection' ? 'border-l-4 border-red-500' : 
      popupStyle === 'invoice' ? 'border-l-4 border-[#992787]' : ''
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedEvent.eventType} Details
        </h2>
        <button
          onClick={() => setShowPopup(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiXCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-4 max-h-[60vh]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Event Code</label>
              <p className="font-medium">{selectedEvent.eventCode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Company</label>
              <p className="font-medium">{selectedEvent.clientName}</p>
            </div>
          </div>

          {popupStyle === 'rejection' ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <FiAlertCircle className="w-5 h-5" />
                <h4 className="font-semibold">Rejection Reason</h4>
              </div>
              <p className="text-gray-700">{popupContent}</p>
            </div>
          ) : popupStyle === 'invoice' ? (
            <div className="border-t border-b border-gray-100 py-4">
              <div className="flex items-center gap-2 text-[#992787] mb-4">
                <FiFileText className="w-5 h-5" />
                <h4 className="font-semibold">Invoice Details</h4>
              </div>
              {renderInvoice(popupContent)}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{popupContent}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowPopup(false)}
          className="px-6 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors"
        >
          Close Details
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManageApplications;