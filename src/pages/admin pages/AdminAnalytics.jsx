import React, { useEffect, useState } from 'react';
import Analytics from '../Analytics';

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const mockData = {
                totalPatients: 1500,
                activeCases: 400,
                recoveredPatients: 1000,
                criticalCases: 100,
                nursesOnDuty: 90,
            };
            setAnalyticsData(mockData);
        };

        fetchData();
    }, []);

    return <Analytics title="Admin Analytics" data={analyticsData} />;
};

export default AdminAnalytics;