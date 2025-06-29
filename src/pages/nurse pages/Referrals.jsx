import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNurseEvent } from '../../../context/NurseEventContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Backend= import.meta.env.BACKEND_URL;
const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventData, isLoading: eventLoading } = useNurseEvent();

  console.log(eventData)
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!eventData?._id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${Backend}/api/v1/refferals/event/${eventData._id}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setReferrals(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch referrals');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Server error');
        toast.error('Failed to load referrals');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [eventData]);

  if (eventLoading || loading) {
    return (
      <div className="p-8 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#992787] dark:border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading referrals...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-xl max-w-md text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Error Loading Referrals
          </h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='p-8 dark:bg-gray-900 min-h-screen'>
      <ToastContainer />
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#992787] dark:text-purple-400">
          Patient Referrals
        </h2>
        
        <div className="bg-[#992787]/10 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
          <p className="text-[#992787] dark:text-purple-400 font-medium">
            Current Event: <span className="font-bold">{eventData?.eventName}</span>
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#992787] dark:bg-purple-800">
              <tr>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm rounded-tl-2xl">
                  Patient
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  ID Number
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  Doctor
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  Doctor Email
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm rounded-tr-2xl">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <HiOutlineDocumentAdd className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">No referrals found for this event</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Referrals you create will appear here
                    </p>
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr 
                    key={referral._id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                      {referral.patient?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.patient?.idNumber || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.practitionerName}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.practitionerEmail}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {formatDate(referral.referralDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' 
                          : referral.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300 max-w-xs">
                      <p className="truncate hover:text-clip">
                        {referral.comments}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {referrals.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-500 dark:text-gray-400">
            Showing {referrals.length} referral{referrals.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;