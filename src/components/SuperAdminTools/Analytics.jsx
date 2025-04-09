import React, { useEffect, useState } from 'react';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Fetch analytics data from an API or mock data
    const fetchData = async () => {
      const mockData = {
        totalPatients: 1200,
        activeAdmins: 15,
        nursesOnDuty: 50,
        reportsGenerated: 300,
      };
      setAnalyticsData(mockData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      {analyticsData ? (
        <div className="space-y-3">
          <p>Total Patients: {analyticsData.totalPatients}</p>
          <p>Active Admins: {analyticsData.activeAdmins}</p>
          <p>Nurses on Duty: {analyticsData.nursesOnDuty}</p>
          <p>Reports Generated: {analyticsData.reportsGenerated}</p>
        </div>
      ) : (
        <p>Loading analytics data...</p>
      )}
    </div>
  );
};

export default Analytics;
