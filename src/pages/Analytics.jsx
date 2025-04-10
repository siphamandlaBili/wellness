import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        // Mock health-related analytics data
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

    const barData = {
        labels: ['Total Patients', 'Active Cases', 'Recovered Patients', 'Critical Cases', 'Nurses On Duty'],
        datasets: [
            {
                label: 'Health Metrics',
                data: analyticsData
                    ? [
                          analyticsData.totalPatients,
                          analyticsData.activeCases,
                          analyticsData.recoveredPatients,
                          analyticsData.criticalCases,
                          analyticsData.nursesOnDuty,
                      ]
                    : [],
                backgroundColor: ['#6b46c1', '#ed8936', '#48bb78', '#e53e3e', '#4299e1'],
            },
        ],
    };

    const pieData = {
        labels: ['Active Cases', 'Recovered Patients', 'Critical Cases'],
        datasets: [
            {
                label: 'Case Distribution',
                data: analyticsData
                    ? [analyticsData.activeCases, analyticsData.recoveredPatients, analyticsData.criticalCases]
                    : [],
                backgroundColor: ['#ed8936', '#48bb78', '#e53e3e'],
            },
        ],
    };

    const lineData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Weekly Patient Growth',
                data: [200, 400, 600, 1200],
                borderColor: '#6b46c1',
                backgroundColor: 'rgba(107, 70, 193, 0.2)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Health Analytics</h2>
            {analyticsData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-purple-700 mb-4">Health Metrics</h3>
                        <Bar data={barData} />
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-purple-700 mb-4">Case Distribution</h3>
                        <Pie data={pieData} />
                    </div>

                    {/* Line Chart */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-purple-700 mb-4">Weekly Patient Growth</h3>
                        <Line data={lineData} />
                    </div>

                    {/* Image Section */}
                    <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 sm:col-span-2">
                        <h3 className="text-xl font-semibold text-purple-700 mb-4">Health Awareness</h3>
                        <img
                            src="https://via.placeholder.com/600x300"
                            alt="Health Awareness"
                            className="rounded-lg w-full"
                        />
                    </div>
                </div>
            ) : (
                <p>Loading analytics data...</p>
            )}
        </div>
    );
};

export default Analytics;