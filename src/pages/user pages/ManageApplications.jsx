import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { 
  FiEye, 
  FiXCircle, 
  FiAlertCircle, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiGrid,
  FiList
} from 'react-icons/fi';

// Cache configuration
const CACHE_KEY = 'eventsCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const Backend= import.meta.env.VITE_BACKEND_URL;
const ManageApplications = () => {
  const [eventStorage, setEventStorage] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [popupStyle, setPopupStyle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTableView, setIsTableView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  // Cache functions
  const getCachedEvents = () => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    const { data, timestamp } = JSON.parse(cache);
    const isCacheValid = Date.now() - timestamp < CACHE_DURATION;
    return isCacheValid ? data : null;
  };

  const setCachedEvents = (data) => {
    const cache = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  };

  const getEvents = async (signal) => {
    try {
      setIsLoading(true);
      
      // Check cache first
      const cachedData = getCachedEvents();
      if (cachedData) {
        setEventStorage(cachedData);
        setIsLoading(false);
      }

      // Fetch fresh data
      const response = await axios.get(
        `${Backend}/api/v1/events/user-events`,
        { 
          withCredentials: true,
          signal 
        }
      );

      // Process and cache new data
      const correctedEvents = response.data.events.map(event => ({
        ...event,
        status: event.status === 'Rejacted' ? 'Rejected' : event.status
      }));
      
      setCachedEvents(correctedEvents);
      setEventStorage(correctedEvents);
      setIsLoading(false);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching events:', error);
        if (!cachedData) setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getEvents(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 900;
      setIsTableView(!isMobile);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedEvents = eventStorage.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(eventStorage.length / itemsPerPage);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    if (event.status?.toLowerCase() === 'rejected') {
      setPopupContent(event.reason);
      setPopupStyle('rejection');
    } else if (event.status?.toLowerCase() === 'accepted') {
      const invoiceData = {
        invoiceNumber: event.eventCode,
        date: event.createdAt,
        clientName: `${event.clientName}`,
        clientEmail: event?.clientEmail,
        items: event.invoiceItems.map(item => ({
          description: item.description,
          amount: `R${parseFloat(item.amount).toFixed(2)}`
        })),
        total: `R${event.invoiceItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}`
      };
      setPopupContent(invoiceData);
      setPopupStyle('invoice');
    } else {
      setPopupContent('No details available yet, our team will get back to you shortly');
      setPopupStyle('no-status');
    }
    setShowPopup(true);
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      accepted: 'bg-green-100 dark:bg-green-800/20 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-800/20 text-red-800 dark:text-red-300',
      pending: 'bg-yellow-100 dark:bg-yellow-800/20 text-yellow-800 dark:text-yellow-300'
    };
    
    const normalizedStatus = status?.toLowerCase();
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[normalizedStatus] || 'bg-gray-100 dark:bg-gray-800'}`}>
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
            <th className='py-4 px-6 text-left text-[#992787] dark:text-purple-300 font-semibold'>Event Name</th>
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
              <td className='py-4 px-6 dark:text-gray-300'>{event.eventName}</td>
              <td className='py-4 px-6 max-md:hidden dark:text-gray-300'>
                {new Date(event.eventDate).toLocaleDateString()}
              </td>
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
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{event.eventName}</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p><FiCalendar className="inline mr-2" />
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
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
      
      // Header
      doc.setFillColor(45, 55, 72);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Company Info
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text("Wellness Events Co.", 14, 20);
      doc.setFontSize(10);
      doc.text("123 Event Street, City, Country", 14, 27);
      doc.text("Tel: (555) 123-4567 | Email: info@wellnessevents.com", 14, 34);

      // Invoice Details
      doc.setTextColor(153, 39, 135);
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
      doc.text(invoiceData.clientName, 14, yPos + 5);
      doc.text(invoiceData.clientEmail, 14, yPos + 10);

      // Items Table
      yPos += 30;
      doc.setFillColor(245, 245, 245);
      doc.rect(14, yPos, pageWidth - 28, 10, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("Description", 14, yPos + 7);
      doc.text("Amount", pageWidth - 24, yPos + 7, { align: 'right' });
      
      yPos += 10;
      invoiceData.items.forEach((item, index) => {
        doc.setFont('helvetica', 'normal');
        doc.text(item.description, 14, yPos + 7 + (index * 10));
        doc.text(item.amount, pageWidth - 24, yPos + 7 + (index * 10), { align: 'right' });
      });

      // Total
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

        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div>
            <h4 className="text-sm font-semibold text-[#992787] dark:text-purple-400 mb-2">Bill To:</h4>
            <p className="font-medium dark:text-gray-200">{invoiceData.clientName}</p>
            <p className="text-gray-600 dark:text-gray-300">{invoiceData.clientEmail}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#992787] dark:text-purple-400">
              Invoice #: {invoiceData.invoiceNumber}
            </p>
          </div>
        </div>

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

        <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="w-64 space-y-4">
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-4">
              <span className="text-xl font-bold text-[#992787] dark:text-purple-400">Total Due:</span>
              <span className="text-xl font-bold text-[#992787] dark:text-purple-400">{invoiceData.total}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Thank you for your business! Please make payment by the due date.</p>
          <p className="mt-1">Payment Terms: Net 30 Days</p>
        </div>

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

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin text-[#992787] dark:text-purple-400">
        <FiLoader className="w-12 h-12" />
      </div>
    </div>
  );

  return (
    <div className='container p-6 max-w-7xl mx-auto dark:bg-gray-900 min-h-screen'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2d3748] dark:text-gray-100">Event Applications</h1>
        {!isLoading && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTableView(!isTableView)}
              className="p-2 text-[#992787] dark:text-purple-400 hover:bg-[#992787]/10 dark:hover:bg-purple-400/10 rounded-lg transition-colors"
              title={isTableView ? "Switch to Card View" : "Switch to Table View"}
            >
              {isTableView ? (
                <FiGrid className="w-6 h-6" />
              ) : (
                <FiList className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {isTableView ? <TableView /> : <CardView />}

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
        </>
      )}

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm z-50">
          <div className={`bg-white dark:bg-gray-800 w-full max-w-2xl p-8 rounded-2xl shadow-2xl flex flex-col ${
            popupStyle === 'rejection' ? 'border-l-4 border-red-500 dark:border-red-400' : 
            popupStyle === 'invoice' ? 'border-l-4 border-[#992787] dark:border-purple-400' : ''
          }`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedEvent.eventName} Details
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
                    <label className="text-sm text-gray-500 dark:text-gray-400">Client</label>
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