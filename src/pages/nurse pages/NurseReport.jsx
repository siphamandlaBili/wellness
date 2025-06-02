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
  HiOutlineDownload
} from "react-icons/hi";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { useNurseEvent } from "../../../context/NurseEventContext";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Register Chart.js components
Chart.register(...registerables);

// Color palette for charts
const CHART_COLORS = {
  normal: '#81c784',
  elevated: '#ffb74d',
  high: '#e57373',
  underweight: '#4fc3f7',
  overweight: '#ffb74d',
  obese: '#e57373',
  unknown: '#bdbdbd',
  fasting: '#64b5f6',
  random: '#ffd54f',
  postprandial: '#ff8a65',
  borderline: '#ffb74d',
  male: '#64b5f6',
  female: '#f06292'
};

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
  const [isExporting, setIsExporting] = useState(false);
  
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
        {"nurseId":`${eventData?.assignedNurse}`},
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

  // Export to Excel function
  const exportToExcel = () => {
    if (!stats || !report) return;
    
    setIsExporting(true);
    try {
      // Prepare data for Excel
      const workbook = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Event Name', eventData?.eventName],
        ['Event Date', new Date(eventData?.eventDate).toLocaleDateString()],
        ['Total Patients', stats.patientCount],
        ['Average Blood Pressure', stats.averageBloodPressure],
        ['Average BMI', stats.averageBmi],
        ['Average HbA1c', `${stats.averageHba1c}%`],
        ['Average Cholesterol', `${stats.averageCholesterol} mg/dL`],
        ['Average Glucose', `${stats.averageGlucose} mmol/L`],
        [],
        ['Demographics', 'Count'],
        ['Male', stats.sex.male],
        ['Female', stats.sex.female],
        ['Adults (18-39)', stats.age.adults],
        ['Middle-Aged (40-59)', stats.age.middleAged],
        ['Seniors (60+)', stats.age.seniors],
        ['HIV Positive', stats.hiv.positive]
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // Medical opinion sheet
      const opinionData = [
        ['Medical Opinion'],
        ...opinion.split('\n').map(line => [line])
      ];
      
      const opinionSheet = XLSX.utils.aoa_to_sheet(opinionData);
      XLSX.utils.book_append_sheet(workbook, opinionSheet, 'Medical Opinion');
      
      // Generate and save Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${eventData?.eventName}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      toast.success("Excel report downloaded successfully");
    } catch (error) {
      toast.error("Failed to export to Excel");
      console.error("Excel export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF function
  const exportToPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const input = reportRef.current;
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${eventData?.eventName}_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      toast.error("Failed to export to PDF");
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Word function
  const exportToWord = async () => {
    if (!stats || !report) return;
    
    setIsExporting(true);
    try {
      // Create document content
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${eventData?.eventName} Health Report`,
                  bold: true,
                  size: 28,
                })
              ],
              alignment: "center",
              spacing: { after: 300 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Event Date: ${new Date(eventData?.eventDate).toLocaleDateString()}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Health Statistics Summary",
                  bold: true,
                  size: 24,
                  underline: true
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Patients: ${stats.patientCount}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Average Blood Pressure: ${stats.averageBloodPressure}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Average BMI: ${stats.averageBmi}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Average HbA1c: ${stats.averageHba1c}%`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Average Cholesterol: ${stats.averageCholesterol} mg/dL`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Average Glucose: ${stats.averageGlucose} mmol/L`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Demographics",
                  bold: true,
                  size: 24,
                  underline: true
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Male: ${stats.sex.male}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Female: ${stats.sex.female}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Adults (18-39): ${stats.age.adults}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Middle-Aged (40-59): ${stats.age.middleAged}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Seniors (60+): ${stats.age.seniors}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `HIV Positive: ${stats.hiv.positive}`,
                  size: 22,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Medical Opinion",
                  bold: true,
                  size: 24,
                  underline: true
                })
              ],
              spacing: { before: 300, after: 200 }
            }),
            ...opinion.split('\n').map(line => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                  })
                ],
                spacing: { after: 100 }
              })
            )
          ]
        }]
      });

      // Generate and save Word document
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `${eventData?.eventName}_Report_${new Date().toISOString().slice(0, 10)}.docx`);
      
      toast.success("Word document downloaded successfully");
    } catch (error) {
      toast.error("Failed to export to Word");
      console.error("Word export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderBMIChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        BMI Distribution
      </h3>
      <div className="h-64">
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
              backgroundColor: [
                CHART_COLORS.underweight,
                CHART_COLORS.normal,
                CHART_COLORS.overweight,
                CHART_COLORS.obese,
                CHART_COLORS.unknown
              ],
              borderWidth: 0
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#6b7280',
                  font: {
                    size: window.innerWidth < 768 ? 10 : 11
                  },
                  padding: 15
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.chart.getDatasetMeta(0).total;
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );

  const renderGlucoseChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Glucose Level Distribution
      </h3>
      <div className="h-64">
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
              backgroundColor: [
                CHART_COLORS.fasting,
                CHART_COLORS.random,
                CHART_COLORS.postprandial,
                CHART_COLORS.unknown
              ],
              borderRadius: 6,
              borderSkipped: false,
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
                grid: {
                  display: false
                },
                title: { 
                  display: true, 
                  text: "Glucose Type",
                  color: '#6b7280',
                  font: {
                    weight: 'bold'
                  }
                },
                ticks: {
                  color: '#6b7280'
                }
              },
              y: { 
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  drawBorder: false
                },
                title: { 
                  display: true, 
                  text: "Number of Patients",
                  color: '#6b7280',
                  font: {
                    weight: 'bold'
                  }
                },
                ticks: {
                  color: '#6b7280',
                  precision: 0
                },
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  );

  const renderCholesterolChart = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Cholesterol Distribution
      </h3>
      <div className="h-64">
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
              backgroundColor: [
                CHART_COLORS.normal,
                CHART_COLORS.borderline,
                CHART_COLORS.high,
                CHART_COLORS.unknown
              ],
              borderRadius: 6,
              borderSkipped: false,
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
                grid: {
                  display: false
                },
                title: { 
                  display: true, 
                  text: "Cholesterol Level",
                  color: '#6b7280',
                  font: {
                    weight: 'bold'
                  }
                },
                ticks: {
                  color: '#6b7280'
                }
              },
              y: { 
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  drawBorder: false
                },
                title: { 
                  display: true, 
                  text: "Number of Patients",
                  color: '#6b7280',
                  font: {
                    weight: 'bold'
                  }
                },
                ticks: {
                  color: '#6b7280',
                  precision: 0
                },
                beginAtZero: true
              }
            }
          }}
        />
      </div>
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
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md" ref={reportRef}>
      <ToastContainer position="top-right" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#992787] dark:text-purple-400 flex items-center gap-2">
          <HiOutlineDocumentText className="w-6 h-6" />
          Event Health Report
        </h2>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={fetchStatistics}
            disabled={loadingStats}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
              loadingStats
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            } text-gray-800 dark:text-gray-100 transition-colors text-sm sm:text-base`}
          >
            <HiOutlineRefresh className="w-4 h-4 sm:w-5 sm:h-5" />
            Refresh Stats
          </button>
          
          {report && (
            <div className="relative inline-block text-left">
              <button
                onClick={() => document.getElementById('export-dropdown')?.classList.toggle('hidden')}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-[#992787] hover:bg-[#7a1f6e] text-white transition-colors text-sm sm:text-base"
                disabled={isExporting}
              >
                <HiOutlineDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                {isExporting ? "Exporting..." : "Export Report"}
              </button>
              
              <div 
                id="export-dropdown" 
                className="hidden absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => {
                      document.getElementById('export-dropdown')?.classList.add('hidden');
                      exportToExcel();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('export-dropdown')?.classList.add('hidden');
                      exportToPDF();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    PDF (.pdf)
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('export-dropdown')?.classList.add('hidden');
                      exportToWord();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Word (.docx)
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!report && (
            <button
              onClick={generateOpinion}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#992787] hover:bg-[#7a1f6e]"
              } text-white transition-colors text-sm sm:text-base flex-1 sm:flex-initial`}
            >
              {isGenerating ? "Generating..." : "Generate AI Opinion"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">
          {eventData?.eventName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {new Date(eventData?.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
          {report?.status === "finalized" ? "Final Report" : "Draft Report"}
        </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  className="flex items-center gap-1 text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 text-sm"
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
            <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Report finalized by {report.nurse?.fullName || "you"} on{" "}
                {new Date(report.updatedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-transform hover:scale-[1.02]">
    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
      {value || "N/A"}
    </p>
  </div>
);

export default EventReport;