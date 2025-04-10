import React, { useState, useEffect } from 'react';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    // Fetch referrals from localStorage (mocking backend)
    const storedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    setReferrals(storedReferrals);
  }, []);

  return (
    <div className="container p-4 max-w-5xl">
      <h2 className="text-2xl font-bold text-[#992787] mb-6">Patient Referrals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead className="bg-[#992787] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Referral Comment</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id} className="text-gray-700">
                <td className="py-2 px-4 border-b">{referral.name}</td>
                <td className="py-2 px-4 border-b">{referral.email}</td>
                <td className="py-2 px-4 border-b">{referral.referralComment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Referrals;