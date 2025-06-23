import React, { useState, useEffect } from "react";
import axios from "axios";

const StatsViewer = ({ eventId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://wellness-backend-ntls.onrender.com/api/v1/reports/stats/${eventId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          console.error("API returned an error:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchStats();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No statistics available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-8">
      <h2 className="text-xl font-bold text-[#992787]">Live Health Statistics</h2>

      <div className="space-y-4">
        <p><strong>Total Patients:</strong> {stats.patientCount}</p>
        <p><strong>Average Blood Pressure:</strong> {stats.averageBloodPressure}</p>
        <p><strong>Average BMI:</strong> {stats.averageBmi}</p>
        <p><strong>Average HbA1c:</strong> {stats.averageHba1c}%</p>
        <p><strong>Average Cholesterol:</strong> {stats.averageCholesterol} mg/dL</p>
        <p><strong>Average Glucose:</strong> {stats.averageGlucose} mmol/L</p>
        <p><strong>Male Patients:</strong> {stats.sex.male}</p>
        <p><strong>Female Patients:</strong> {stats.sex.female}</p>
        <p><strong>Adults (18-39):</strong> {stats.age.adults}</p>
        <p><strong>Middle-Aged (40-59):</strong> {stats.age.middleAged}</p>
        <p><strong>Seniors (60+):</strong> {stats.age.seniors}</p>
        <p><strong>HIV Positive:</strong> {stats.hiv.positive}</p>
      </div>
    </div>
  );
};

export default StatsViewer;
