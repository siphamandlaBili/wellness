import React, { useState, useEffect } from 'react';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const storedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    setReferrals(storedReferrals);
  }, []);

  return (
    <div className='m-8'>
      <h2 className="text-3xl font-bold text-[#992787] mb-8 relative pl-4">
        Patient Referrals
      </h2>
      
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#992787]">
              <tr>
                <th className="py-4 px-6 text-left text-white font-semibold uppercase tracking-wider text-sm rounded-tl-2xl">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-white font-semibold uppercase tracking-wider text-sm">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-white font-semibold uppercase tracking-wider text-sm rounded-tr-2xl">
                  Referral Comment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {referral.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {referral.email}
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs">
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