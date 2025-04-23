import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { jsPDF } from "jspdf";
import { 
  FiEye, 
  FiXCircle, 
  FiFileText, 
  FiAlertCircle, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiDownload,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const ManageApplications = () => {
  const { userEvents, setEventStorage, user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupStyle, setPopupStyle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTableView, setIsTableView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [userEvents]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEvents = userEvents?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((userEvents?.length || 0) / itemsPerPage);

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
      approved: 'bg-green-100 dark:bg-green-800/20 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-800/20 text-red-800 dark:text-red-300',
      pending: 'bg-yellow-100 dark:bg-yellow-800/20 text-yellow-800 dark:text-yellow-300'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-800'}`}>
        {status || "Pending"}
      </span>
    );
  };

  const TableView = () => (
    <div className='overflow-x-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700'>
      <table className='min-w-full bg-white dark:bg-gray-800'>
        <thead className='bg-[#992787]/10 dark:bg-purple-900/20'>
          <tr>
            <th className='py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold'>Event Code</th>
            <th className='py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold'>Type</th>
            <th className='py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold max-md:hidden'>Date</th>
            <th className='py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold max-lg:hidden'>Location</th>
            <th className='py-4 px-6 text-center text-[#992787] dark:text-purple-300 font-semibold'>Attendees</th>
            <th className='py-4 px-6 text-center text-[#992787] dark:text-purple-300 font-semibold'>Status</th>
            <th className='py-4 px-6 text-center text-[#992787] dark:text-purple-300 font-semibold'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
          {paginatedEvents?.map((event, index) => (
            <tr key={index} className='hover:bg-[#f9f4f9] dark:hover:bg-gray-700 transition-colors'>
              <td className='py-4 px-6 font-medium dark:text-gray-100'>{event.eventCode}</td>
              <td className='py-4 px-6 dark:text-gray-300'>{event.eventType}</td>
              <td className='py-4 px-6 max-md:hidden dark:text-gray-300'>{event.eventDate}</td>
              <td className='py-4 px-6 max-lg:hidden dark:text-gray-300'>{event.eventLocation}</td>
              <td className='py-4 px-6 text-center dark:text-gray-300'>{event.numberOfAttendees}</td>
              <td className='py-4 px-6 text-center'><StatusBadge status={event.status} /></td>
              <td className='py-4 px-6 text-center'>
                <button
                  onClick={() => handleViewDetails(event)}
                  className="text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 transition-colors"
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
      {paginatedEvents?.map((event, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[#992787] dark:text-purple-400 font-semibold">{event.eventCode}</span>
            <StatusBadge status={event.status} />
          </div>
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{event.eventType}</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p><FiCalendar className="inline mr-2" />{event.eventDate}</p>
            <p><FiMapPin className="inline mr-2" />{event.eventLocation}</p>
            <p><FiUsers className="inline mr-2" />{event.numberOfAttendees} attendees</p>
          </div>
          <button
            onClick={() => handleViewDetails(event)}
            className="mt-4 w-full py-2 text-[#992787] dark:text-purple-400 hover:bg-[#992787]/10 dark:hover:bg-purple-400/10 rounded-lg transition-colors"
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
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add gradient header
    doc.setFillColor(45, 55, 72); // Dark gray
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Info
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text("Wellness Events Co.", 14, 20);
    doc.setFontSize(10);
    doc.text("123 Event Street, City, Country", 14, 27);
    doc.text("Tel: (555) 123-4567 | Email: info@wellnessevents.com", 14, 34);

    // Invoice title and details
    doc.setTextColor(153, 39, 135); // Brand purple
    doc.setFontSize(20);
    doc.text("INVOICE", pageWidth - 60, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const invoiceDetails = [
      `Invoice Number: ${invoiceData.invoiceNumber}`,
      `Date: ${new Date(invoiceData.date).toLocaleDateString()}`,
      `Due Date: ${new Date(invoiceData.date).toLocaleDateString()}`,
    ];
    
    let yPos = 40;
    invoiceDetails.forEach((detail, i) => {
      doc.text(detail, pageWidth - 60, 30 + (i * 5));
    });

    // Client Info
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Bill To:", 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(selectedEvent.clientName, 14, yPos + 5);
    doc.text(selectedEvent.clientEmail, 14, yPos + 10);

    // Table header
    yPos += 30;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, yPos, pageWidth - 28, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Description", 14, yPos + 7);
    doc.text("Amount", pageWidth - 24, yPos + 7, { align: 'right' });
    
    // Table rows
    yPos += 10;
    invoiceData.items.forEach((item, index) => {
      doc.setFont('helvetica', 'normal');
      doc.text(item.description, 14, yPos + 7 + (index * 10));
      doc.text(item.amount, pageWidth - 24, yPos + 7 + (index * 10), { align: 'right' });
    });

    // Total section
    yPos += (invoiceData.items.length * 10) + 20;
    doc.setFont('helvetica', 'bold');
    doc.text("Total Due:", pageWidth - 64, yPos);
    doc.text(invoiceData.total, pageWidth - 24, yPos, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business! Please make payment by the due date.", 14, 280);
    doc.text("Payment Terms: Net 30 Days", 14, 285);

    doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d3748] to-[#4a5568] p-6 rounded-xl text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Wellness Events Co.</h2>
            <p className="mt-1 text-sm opacity-90">123 Event Street, City, Country</p>
            <p className="text-sm opacity-90">Tel: (555) 123-4567 | Email: info@wellnessevents.com</p>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-bold text-[#ff99e8]">INVOICE</h3>
            <p className="mt-2 text-sm opacity-90">Date: {new Date(invoiceData.date).toLocaleDateString()}</p>
            <p className="text-sm opacity-90">Due Date: {new Date(invoiceData.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <div>
          <h4 className="text-sm font-semibold text-[#992787] dark:text-purple-400 mb-2">Bill To:</h4>
          <p className="font-medium dark:text-gray-200">{selectedEvent.clientName}</p>
          <p className="text-gray-600 dark:text-gray-300">{selectedEvent.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#992787] dark:text-purple-400">
            Invoice #: {invoiceData.invoiceNumber}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="col-span-8 font-semibold text-[#992787] dark:text-purple-400">Description</div>
          <div className="col-span-4 font-semibold text-[#992787] dark:text-purple-400 text-right">Amount</div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="col-span-8 dark:text-gray-300">{item.description}</div>
              <div className="col-span-4 dark:text-gray-300 text-right">{item.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Section */}
      <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <div className="w-64 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold dark:text-gray-200">Subtotal:</span>
            <span className="dark:text-gray-300">{invoiceData.total}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-4">
            <span className="text-xl font-bold text-[#992787] dark:text-purple-400">Total Due:</span>
            <span className="text-xl font-bold text-[#992787] dark:text-purple-400">{invoiceData.total}</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Thank you for your business! Please make payment by the due date.</p>
        <p className="mt-1">Payment Terms: Net 30 Days</p>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        className="w-full mt-6 px-6 py-3 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        <FiDownload className="w-5 h-5" />
        Download Invoice
      </button>
    </div>
  );
};

  return (
    <div className='container p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2d3748] dark:text-gray-100">Event Applications</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="p-2 text-[#992787] dark:text-purple-400 hover:bg-[#992787]/10 dark:hover:bg-purple-400/10 rounded-lg transition-colors"
            title={isTableView ? "Switch to Card View" : "Switch to Table View"}
          >
            <FiEye className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isTableView ? <TableView /> : <CardView />}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm z-50">
          <div className={`bg-white dark:bg-gray-800 w-full max-w-2xl p-8 rounded-2xl shadow-2xl flex flex-col ${
            popupStyle === 'rejection' ? 'border-l-4 border-red-500 dark:border-red-400' : 
            popupStyle === 'invoice' ? 'border-l-4 border-[#992787] dark:border-purple-400' : ''
          }`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedEvent.eventType} Details
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Event Code</label>
                    <p className="font-medium dark:text-gray-200">{selectedEvent.eventCode}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Company</label>
                    <p className="font-medium dark:text-gray-200">{selectedEvent.clientName}</p>
                  </div>
                </div>

                {popupStyle === 'rejection' ? (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-300 mb-2">
                      <FiAlertCircle className="w-5 h-5" />
                      <h4 className="font-semibold">Rejection Reason</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{popupContent}</p>
                  </div>
                ) : popupStyle === 'invoice' ? (
                  <div className="border-t border-b border-gray-100 dark:border-gray-700 py-4">
                    <div className="flex items-center gap-2 text-[#992787] dark:text-purple-400 mb-4">
                      <FiFileText className="w-5 h-5" />
                      <h4 className="font-semibold">Invoice Details</h4>
                    </div>
                    {renderInvoice(popupContent)}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">{popupContent}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors"
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