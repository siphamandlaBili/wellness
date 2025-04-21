import React, { useState, useEffect } from 'react';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const storedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    setReferrals(storedReferrals);
  }, []);

  return (
    <div className='p-8 dark:bg-gray-900 min-h-screen'>
      <h2 className="text-3xl font-bold text-[#992787] dark:text-purple-400 mb-8 relative pl-4">
        Patient Referrals
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#992787] dark:bg-purple-800">
              <tr>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm rounded-tl-2xl">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  client Email
                </th>
                <th className="py-4 px-6 text-left  text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  doctor Name
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm">
                  doctor Email
                </th>
                <th className="py-4 px-6 text-left text-white dark:text-purple-200 font-semibold uppercase tracking-wider text-sm rounded-tr-2xl">
                  Referral Comment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr 
                    key={referral.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                      {`${referral.name} ${referral.surname}`}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.email}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.practitionerName}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {referral.practitionerEmail}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300 max-w-xs">
                      <p className="truncate hover:text-clip">
                        {referral.referralComment}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Referrals;