import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineSave,
  HiOutlineChartBar,
  HiOutlineRefresh,
  HiOutlineDownload,
} from "react-icons/hi";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useNurseEvent } from "../../../context/NurseEventContext";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

// Register Chart.js components
Chart.register(...registerables);

// Color palette for charts
const CHART_COLORS = {
  normal: "#81c784",
  elevated: "#ffb74d",
  high: "#e57373",
  underweight: "#4fc3f7",
  overweight: "#ffb74d",
  obese: "#e57373",
  unknown: "#bdbdbd",
  fasting: "#64b5f6",
  random: "#ffd54f",
  postprandial: "#ff8a65",
  borderline: "#ffb74d",
  male: "#64b5f6",
  female: "#f06292",
};

const ReportPDF = () => {
  const { eventData } = useNurseEvent();
  const [report, setReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [editing, setEditing] = useState(false);
  const [opinion, setOpinion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Ref for the report container
  const reportRef = useRef(null);

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
        { nurseId: `${eventData?.assignedNurse}` },
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

  // PDF Download Logic with advanced splitting for multipage PDF
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(reportRef.current, {
        backgroundColor: "#fff",
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Create an image and get its dimensions
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = function () {
        const imgProps = {
          width: img.width,
          height: img.height,
        };
        // Calculate the ratio to fit the image to the page width
        const ratio = pageWidth / imgProps.width;
        const imgWidth = pageWidth;
        const imgHeight = imgProps.height * ratio;

        let position = 0;
        let remainingHeight = imgHeight;
        let pageNum = 0;

        // Advanced splitting: draw only the visible part of the image on each page
        while (remainingHeight > 0) {
          // Calculate the source Y position in the image for this page
          const sourceY = (pageNum * pageHeight) / ratio;
          // Create a canvas to crop the image for this page
          const canvas = document.createElement("canvas");
          canvas.width = imgProps.width;
          // Height in px for this page
          canvas.height = Math.min(
            pageHeight / ratio,
            imgProps.height - sourceY
          );

          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            0,
            sourceY,
            imgProps.width,
            canvas.height,
            0,
            0,
            imgProps.width,
            canvas.height
          );
          const pageDataUrl = canvas.toDataURL("image/png");

          if (pageNum > 0) pdf.addPage();
          pdf.addImage(
            pageDataUrl,
            "PNG",
            0,
            0,
            imgWidth,
            canvas.height * ratio
          );

          remainingHeight -= pageHeight;
          pageNum++;
        }

        pdf.save(`${eventData?.eventName || "Event"}_Health_Report.pdf`);
        toast.success("Report downloaded as PDF!");
        setIsExporting(false);
      };
    } catch (error) {
      toast.error("Failed to export PDF");
      setIsExporting(false);
    }
  };

  const renderGlucoseChart = () => {
    // Calculate total for percentage
    const total =
      stats.glucose.fasting +
      stats.glucose.random +
      stats.glucose.postprandial +
      stats.glucose.unknown;

    // Helper to get percent string
    const percent = (val) =>
      total && val > 0 ? ` (${Math.round((val / total) * 100)}%)` : "";

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4 text-black">
          Glucose Level Distribution
        </h3>
        <Bar
          data={{
            labels: [
              `Fasting${percent(stats.glucose.fasting)}`,
              `Random${percent(stats.glucose.random)}`,
              `Postprandial${percent(stats.glucose.postprandial)}`,
              `Unknown${percent(stats.glucose.unknown)}`,
            ],
            datasets: [
              {
                label: "Patients",
                data: [
                  stats.glucose.fasting,
                  stats.glucose.random,
                  stats.glucose.postprandial,
                  stats.glucose.unknown,
                ],
                backgroundColor: [
                  CHART_COLORS.fasting,
                  CHART_COLORS.random,
                  CHART_COLORS.postprandial,
                  CHART_COLORS.unknown,
                ],
                borderRadius: 6,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }, // Remove hover tooltips
            },
            scales: {
              x: {
                title: { display: true, text: "Glucose Type", color: "#666" },
                ticks: { color: "#666" },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Patients",
                  color: "#666",
                },
                ticks: { color: "#666", precision: 0 },
                beginAtZero: true,
              },
            },
          }}
          height={350}
          width={350}
        />
      </div>
    );
  };

  const renderCholesterolChart = () => {
    const total =
      stats.cholesterol.normal +
      stats.cholesterol.borderline +
      stats.cholesterol.high +
      stats.cholesterol.unknown;

    const percent = (val) =>
      total && val > 0 ? ` (${Math.round((val / total) * 100)}%)` : "";

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4 text-black">
          Cholesterol Distribution
        </h3>
        <Bar
          data={{
            labels: [
              `Normal${percent(stats.cholesterol.normal)}`,
              `Borderline${percent(stats.cholesterol.borderline)}`,
              `High${percent(stats.cholesterol.high)}`,
              `Unknown${percent(stats.cholesterol.unknown)}`,
            ],
            datasets: [
              {
                label: "Patients",
                data: [
                  stats.cholesterol.normal,
                  stats.cholesterol.borderline,
                  stats.cholesterol.high,
                  stats.cholesterol.unknown,
                ],
                backgroundColor: [
                  CHART_COLORS.normal,
                  CHART_COLORS.borderline,
                  CHART_COLORS.high,
                  CHART_COLORS.unknown,
                ],
                borderRadius: 6,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }, // Remove hover tooltips
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Cholesterol Level",
                  color: "#666",
                },
                ticks: { color: "#666" },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Patients",
                  color: "#666",
                },
                ticks: { color: "#666", precision: 0 },
                beginAtZero: true,
              },
            },
          }}
          height={350}
          width={350}
        />
      </div>
    );
  };

  const renderPieChart = (title, labels, data, colors) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-4 text-black">{title}</h3>
      <Pie
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors,
            },
          ],
        }}
        options={{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#6b7280",
                font: {
                  size: 11,
                },
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.chart.getDatasetMeta(0).total;
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        }}
        height={350}
        width={350}
      />
    </div>
  );

  const renderBloodPressureChart = () =>
    renderPieChart(
      "Blood Pressure Distribution",
      ["Normal", "Elevated", "High"],
      [
        stats?.bloodPressure?.normal || 0,
        stats?.bloodPressure?.elevated || 0,
        stats?.bloodPressure?.high || 0,
      ],
      [CHART_COLORS.normal, CHART_COLORS.elevated, CHART_COLORS.high]
    );

  const renderBMIChart = () =>
    renderPieChart(
      "BMI Distribution",
      ["Underweight", "Normal", "Overweight", "Obese"],
      [
        stats.bmi.underweight,
        stats.bmi.normal,
        stats.bmi.overweight,
        stats.bmi.obese,
      ],
      [
        CHART_COLORS.underweight,
        CHART_COLORS.normal,
        CHART_COLORS.overweight,
        CHART_COLORS.obese,
      ]
    );

  const renderHba1cChart = () =>
    renderPieChart(
      "HbA1c Distribution",
      ["Normal (<5.7%)", "Prediabetes (5.7-6.4%)", "Diabetes (≥6.5%)"],
      [stats.hba1c.normal, stats.hba1c.prediabetes, stats.hba1c.diabetes],
      [CHART_COLORS.normal, CHART_COLORS.borderline, CHART_COLORS.high]
    );

  const renderHivChart = () =>
    renderPieChart(
      "HIV Results",
      ["Negative", "Positive", "Inconclusive", "Unknown"],
      [
        stats.hiv.negative,
        stats.hiv.positive,
        stats.hiv.inconclusive,
        stats.hiv.unknown,
      ],
      [
        CHART_COLORS.normal,
        CHART_COLORS.high,
        CHART_COLORS.borderline,
        CHART_COLORS.unknown,
      ]
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-8">
      <ToastContainer position="top-right" />

      {/* Download PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isExporting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#992787] hover:bg-[#7a1f6e]"
          } text-white transition-colors`}
        >
          <HiOutlineDownload className="w-5 h-5" />
          {isExporting ? "Exporting..." : "Download PDF"}
        </button>
      </div>

      {/* Main Report Content */}
      <div ref={reportRef}>
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img src="/src/assets/NEWLOGO1.png" alt="New Logo" className="h-16" />
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#992787] flex items-center gap-2">
            <HiOutlineDocumentText className="w-6 h-6" />
            Health Risk Assessment Report
          </h2>
        </div>

        {/* Event Details Section */}
        <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-bold text-[#992787] mb-4">
            Event Details
          </h3>
          <p className="text-gray-700">
            <strong>Event Name:</strong> {eventData?.eventName}
          </p>
          <p className="text-gray-700">
            <strong>Date:</strong>{" "}
            {new Date(eventData?.eventDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-700">
            <strong>Venue:</strong> {eventData?.venue || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Company:</strong> {eventData?.company || "N/A"}
          </p>
        </div>

        {/* Healthspace FMP Wellness Section */}
        <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-bold text-[#992787] mb-4">
            Healthspace FMP Wellness: Workplace Health Screenings That Drive
            Awareness and Action
          </h3>
          <p className="text-gray-700">
            At Healthspace FMP Wellness, we believe that early detection is key
            to long-term well-being. Our onsite wellness screenings offer
            employees a chance to better understand their health, identify risks
            early, and take meaningful steps toward improvement. Each person
            receives private feedback on the day of the screening, and those
            with concerning results are, with their permission, referred for
            additional testing, professional guidance, or ongoing health
            support.
          </p>
          <p className="text-gray-700 mt-4">
            Many chronic health conditions—including high blood pressure,
            diabetes, respiratory diseases, and some cancers—are linked to
            everyday lifestyle choices such as inactivity, unhealthy eating,
            smoking, unmanaged stress, and excess weight. These issues are
            widespread and affect people across all industries. Including HIV
            screening in our assessments allows us to offer a more complete
            picture of an individual's overall health.
          </p>
          <p className="text-gray-700 mt-4">
            Our screenings are conducted face-to-face by trained professionals
            and include, but are not limited to, the following biometric checks:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mt-2">
            <li>Blood pressure monitoring</li>
            <li>Blood glucose and cholesterol levels</li>
            <li>Body measurements: weight, height, and waist circumference</li>
            <li>HIV testing with pre- and post-test counselling (HCT)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Through these services, Healthspace FMP Wellness supports
            organisations in building healthier, more informed, and more
            resilient workforces.
          </p>
        </div>

        {/* Health Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineChartBar className="w-6 h-6 text-[#992787]" />
            <h3 className="text-xl font-bold text-[#992787]">
              Health Statistics
            </h3>
          </div>

          {loadingStats ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Summary Section */}
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-[#992787] mb-4">Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Total Patients" value={stats.patientCount} />
                  <StatCard
                    title="Avg Blood Pressure"
                    value={stats.averageBloodPressure}
                  />
                  <StatCard title="Avg BMI" value={stats.averageBmi} />
                  <StatCard
                    title="Avg HbA1c"
                    value={`${stats.averageHba1c}%`}
                  />
                  <StatCard
                    title="Avg Cholesterol"
                    value={`${stats.averageCholesterol} mg/dL`}
                  />
                  <StatCard
                    title="Avg Glucose"
                    value={`${stats.averageGlucose} mmol/L`}
                  />
                </div>
              </div>

              {/* Demographics Section */}
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-[#992787] mb-4">
                  Demographics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Male" value={stats.sex.male} />
                  <StatCard title="Female" value={stats.sex.female} />
                  <StatCard title="Adults (18-39)" value={stats.age.adults} />
                  <StatCard
                    title="Middle-Aged (40-59)"
                    value={stats.age.middleAged}
                  />
                  <StatCard title="Seniors (60+)" value={stats.age.seniors} />
                  <StatCard title="HIV Positive" value={stats.hiv.positive} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">No statistics available.</p>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {stats && (
          <div className="space-y-8">
            {/* Bar Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center">
                {renderGlucoseChart()}
              </div>
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center">
                {renderCholesterolChart()}
              </div>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center">
                {renderBloodPressureChart()}
              </div> */}
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center">
                {renderBMIChart()}
              </div>
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center">
                {renderHba1cChart()}
              </div>
              {/* Add padding between HIV stats and Medical Opinion */}
              <div className="bg-[#992787]/10 p-6 rounded-lg shadow-sm flex justify-center items-center mb-8">
                {renderHivChart()}
              </div>
            </div>
          </div>
        )}

        {/* Padding between HIV stats and Medical Opinion */}
        <div style={{ height: 32 }} />

        {/* Medical Opinion Section */}
        {report ? (
          <div className="space-y-6 bg-[#f3e8f9] p-6 rounded-lg shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-[#992787]">Medical Opinion</h4>
                {report.status !== "finalized" && (
                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex items-center gap-1 text-[#992787] hover:text-[#7a1f6e] text-sm"
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
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-[#992787]/20 focus:border-[#992787]"
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
                <div className="prose max-w-none p-4 bg-gray-50 rounded-lg">
                  {opinion.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {report.status === "finalized" && !editing && (
              <div className="mt-6 p-4 border-t border-gray-200 text-sm text-gray-500">
                <p>
                  Report finalized by {report.nurse?.fullName || "you"} on{" "}
                  {new Date(report.updatedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-6">
              No report generated yet for this event
            </p>
            <button
              onClick={generateOpinion}
              disabled={isGenerating}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#992787] hover:bg-[#7a1f6e]"
              } text-white transition-colors mx-auto`}
            >
              {isGenerating ? "Generating..." : "Generate AI Opinion"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm transition-transform hover:scale-[1.02]">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

export default ReportPDF;
