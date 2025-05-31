import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  HiOutlineDocumentText, 
  HiOutlinePencil, 
  HiOutlineSave,
  HiOutlineChartBar,
  HiOutlineRefresh
} from "react-icons/hi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { useNurseEvent } from "../../../context/NurseEventContext";

// Register Chart.js components
Chart.register(...registerables);

const EventReport = () => {
  const { eventData } = useNurseEvent();
  const [report, setReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [editing, setEditing] = useState(false);
  const [opinion, setOpinion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://wellness-backend-ntls.onrender.com/api/v1/reports/event/${eventData?._id}`,
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.report) {
          setReport(response.data.report);
          setOpinion(
            response.data.report.editedOpinion || 
            response.data.report.generatedOpinion || 
            ""
          );
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventData?._id) {
      fetchReportData();
    }
  }, [eventData]);

  const fetchStatistics = async () => {
    try {
      setLoadingStats(true);
      const response = await axios.get(
        `https://wellness-backend-ntls.onrender.com/api/v1/reports/stats/${eventData?._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error("Failed to load statistics");
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (eventData?._id) {
      fetchStatistics();
    }
  }, [eventData]);

  const generateOpinion = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(
        `https://wellness-backend-ntls.onrender.com/api/v1/reports/generate/${eventData?._id}`,
        {},
        { withCredentials: true }
      );
      setReport(response.data.report);
      setOpinion(response.data.report.generatedOpinion);
      setEditing(true);
      toast.success("AI opinion generated successfully");
    } catch (error) {
      toast.error("Failed to generate opinion");
      console.error("Generate opinion error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveOpinion = async () => {
    try {
      setIsSaving(true);
      const response = await axios.put(
        `https://wellness-backend-ntls.onrender.com/api/v1/reports/${report._id}`,
        { editedOpinion: opinion },
        { withCredentials: true }
      );
      setReport(response.data.report);
      setEditing(false);
      toast.success("Opinion saved successfully");
    } catch (error) {
      toast.error("Failed to save opinion");
      console.error("Save opinion error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderBloodPressureChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Blood Pressure Distribution
      </h3>
      <Pie
        data={{
          labels: ["Normal", "Elevated", "High", "Unknown"],
          datasets: [{
            data: [
              stats.bloodPressure.normal,
              stats.bloodPressure.elevated,
              stats.bloodPressure.high,
              stats.bloodPressure.unknown
            ],
            backgroundColor: ["#81c784", "#ffb74d", "#e57373", "#bdbdbd"]
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#333',
                font: {
                  size: 11
                }
              }
            }
          }
        }}
        height={250}
      />
    </div>
  );

  const renderBMIChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        BMI Distribution
      </h3>
      <Pie
        data={{
          labels: ["Underweight", "Normal", "Overweight", "Obese", "Unknown"],
          datasets: [{
            data: [
              stats.bmi.underweight,
              stats.bmi.normal,
              stats.bmi.overweight,
              stats.bmi.obese,
              stats.bmi.unknown
            ],
            backgroundColor: ["#4fc3f7", "#81c784", "#ffb74d", "#e57373", "#bdbdbd"]
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#333',
                font: {
                  size: 11
                }
              }
            }
          }
        }}
        height={250}
      />
    </div>
  );

  const renderGlucoseChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Glucose Level Distribution
      </h3>
      <Bar
        data={{
          labels: ["Fasting", "Random", "Postprandial", "Unknown"],
          datasets: [{
            label: "Patients",
            data: [
              stats.glucose.fasting,
              stats.glucose.random,
              stats.glucose.postprandial,
              stats.glucose.unknown
            ],
            backgroundColor: ["#4fc3f7", "#ffb74d", "#e57373", "#bdbdbd"]
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: "Glucose Type",
                color: '#666'
              },
              ticks: {
                color: '#666'
              }
            },
            y: { 
              title: { 
                display: true, 
                text: "Number of Patients",
                color: '#666'
              },
              ticks: {
                color: '#666',
                precision: 0
              },
              beginAtZero: true
            }
          }
        }}
        height={250}
      />
    </div>
  );

  const renderCholesterolChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Cholesterol Distribution
      </h3>
      <Bar
        data={{
          labels: ["Normal", "Borderline", "High", "Unknown"],
          datasets: [{
            label: "Patients",
            data: [
              stats.cholesterol.normal,
              stats.cholesterol.borderline,
              stats.cholesterol.high,
              stats.cholesterol.unknown
            ],
            backgroundColor: ["#81c784", "#ffb74d", "#e57373", "#bdbdbd"]
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: "Cholesterol Level",
                color: '#666'
              },
              ticks: {
                color: '#666'
              }
            },
            y: { 
              title: { 
                display: true, 
                text: "Number of Patients",
                color: '#666'
              },
              ticks: {
                color: '#666',
                precision: 0
              },
              beginAtZero: true
            }
          }
        }}
        height={250}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <ToastContainer position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#992787] dark:text-purple-400 flex items-center gap-2">
          <HiOutlineDocumentText className="w-6 h-6" />
          Event Health Report
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={fetchStatistics}
            disabled={loadingStats}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              loadingStats
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            } text-gray-800 dark:text-gray-100 transition-colors`}
          >
            <HiOutlineRefresh className="w-5 h-5" />
            Refresh Stats
          </button>
          
          {!report && (
            <button
              onClick={generateOpinion}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#992787] hover:bg-[#7a1f6e]"
              } text-white transition-colors`}
            >
              {isGenerating ? "Generating..." : "Generate AI Opinion"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
          {eventData?.eventName} - {new Date(eventData?.eventDate).toLocaleDateString()}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {report?.status === "finalized" ? "Final Report" : "Draft Report"}
        </p>
      </div>

      {/* Health Statistics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineChartBar className="w-6 h-6 text-[#992787] dark:text-purple-400" />
          <h3 className="text-xl font-bold text-[#992787] dark:text-purple-400">
            Health Statistics
          </h3>
        </div>
        
        {loadingStats ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#992787]/10 dark:bg-purple-900/20 p-4 rounded-xl">
              <h4 className="font-semibold text-[#992787] dark:text-purple-400 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-2">
                <StatCard title="Total Patients" value={stats.patientCount} />
                <StatCard title="Avg Blood Pressure" value={stats.averageBloodPressure} />
                <StatCard title="Avg BMI" value={stats.averageBmi} />
                <StatCard title="Avg HbA1c" value={`${stats.averageHba1c}%`} />
                <StatCard title="Avg Cholesterol" value={`${stats.averageCholesterol} mg/dL`} />
                <StatCard title="Avg Glucose" value={`${stats.averageGlucose} mmol/L`} />
              </div>
            </div>
            
            <div className="bg-[#992787]/10 dark:bg-purple-900/20 p-4 rounded-xl">
              <h4 className="font-semibold text-[#992787] dark:text-purple-400 mb-2">Demographics</h4>
              <div className="grid grid-cols-2 gap-2">
                <StatCard title="Male" value={stats.sex.male} />
                <StatCard title="Female" value={stats.sex.female} />
                <StatCard title="Adults (18-39)" value={stats.age.adults} />
                <StatCard title="Middle-Aged (40-59)" value={stats.age.middleAged} />
                <StatCard title="Seniors (60+)" value={stats.age.seniors} />
                <StatCard title="HIV Positive" value={stats.hiv.positive} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No statistics available. Click "Refresh Stats" to load health data.
            </p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBloodPressureChart()}
            {renderBMIChart()}
            {renderGlucoseChart()}
            {renderCholesterolChart()}
          </div>
        )}
      </div>

      {/* Medical Opinion Section */}
      {report ? (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                Medical Opinion
              </h4>
              {report.status !== "finalized" && (
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-1 text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                  {editing ? "Cancel" : "Edit"}
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-[#992787]/20 focus:border-[#992787] dark:focus:border-purple-400"
                  rows={10}
                  placeholder="Enter your medical opinion..."
                />
                <button
                  onClick={saveOpinion}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#992787] hover:bg-[#7a1f6e]"
                  } text-white transition-colors`}
                >
                  <HiOutlineSave className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Final Opinion"}
                </button>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {opinion.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {report.status === "finalized" && !editing && (
            <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Report finalized by {report.nurse?.fullName || "you"} on{" "}
                {new Date(report.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            No report generated yet for this event
          </p>
          <button
            onClick={generateOpinion}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#992787] hover:bg-[#7a1f6e]"
            } text-white transition-colors`}
          >
            {isGenerating ? "Generating..." : "Generate AI Opinion"}
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
      {value || "N/A"}
    </p>
  </div>
);

export default EventReport;