import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics = ({ title, data }) => {
    const barData = {
        labels: ['Total Patients', 'Active Cases', 'Recovered', 'Critical', 'Nurses'],
        datasets: [
            {
                label: 'Health Metrics',
                data: data
                    ? [
                          data.totalPatients,
                          data.activeCases,
                          data.recoveredPatients,
                          data.criticalCases,
                          data.nursesOnDuty,
                      ]
                    : [],
                backgroundColor: ['#992787', '#d53f8c', '#ed64a6', '#b83280', '#702459'],
                borderColor: 'white',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Active Cases', 'Recovered', 'Critical'],
        datasets: [
            {
                label: 'Case Distribution',
                data: data
                    ? [data.activeCases, data.recoveredPatients, data.criticalCases]
                    : [],
                backgroundColor: ['#992787', '#6a1b9a', '#d53f8c'],
                borderColor: 'white',
                borderWidth: 2,
            },
        ],
    };

    const lineData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Weekly Growth',
                data: [200, 400, 600, 1200],
                borderColor: '#992787',
                backgroundColor: 'rgba(153, 39, 135, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#992787',
            },
        ],
    };

    return (
        <div className="container m-9">
            <h2 className="text-3xl font-bold text-[#992787] mb-8 relative pl-4">{title}</h2>
            {data ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-[#992787] mb-4">Health Metrics Overview</h3>
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                },
                            }}
                        />
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-[#992787] mb-4">Case Distribution</h3>
                        <div className="relative h-60">
                            <Pie
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-[#992787] mb-4">Patient Growth Trend</h3>
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                },
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">Loading analytics data...</div>
            )}
        </div>
    );
};

export default Analytics;