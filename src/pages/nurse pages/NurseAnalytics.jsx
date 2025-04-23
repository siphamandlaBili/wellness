import React, { useEffect, useState } from 'react';
import Analytics from '../../components/Analytics';

const NurseAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const mockData = {
                totalPatients: 1200,
                activeCases: 300,
                recoveredPatients: 850,
                criticalCases: 50,
                nursesOnDuty: 75,
            };
            setAnalyticsData(mockData);
        };

        fetchData();
    }, []);

    return <Analytics title="Nurse Analytics" data={analyticsData} />;
};

export default NurseAnalytics;