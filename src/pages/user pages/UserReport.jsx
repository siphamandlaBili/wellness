import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineDocumentText, HiOutlineDownload, HiOutlineUserGroup,
  HiOutlineCalendar, HiOutlineChevronDown
} from "react-icons/hi";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import axios from "axios";

const Backend = import.meta.env.VITE_BACKEND_URL;

const UserReport = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const reportRef = useRef(null);

  // Health status categories
  const healthStatuses = {
    bloodPressure: {
      Normal: 0,
      Elevated: 0,
      'High Stage 1': 0,
      'High Stage 2': 0,
      'Hypertensive Crisis': 0
    },
    glucose: {
      Normal: 0,
      Prediabetes: 0,
      Diabetes: 0
    },
    cholesterol: {
      Normal: 0,
      'Borderline High': 0,
      High: 0,
      'Very High': 0
    },
    bmi: {
      Underweight: 0,
      Normal: 0,
      Overweight: 0,
      Obesity: 0
    },
    hiv: {
      Positive: 0,
      Negative: 0
    }
  };

  // Fetch company's events
  useEffect(() => {
    const fetchCompanyEvents = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Backend}/api/v1/events/user-events`, {
          withCredentials: true
        });

        const passedEvents = response.data.events.filter(event => {
          const eventDate = new Date(event.eventDate);
          return (eventDate <= new Date()) && (event.status === "Accepted");
 // Filter out past events
        });

        setEvents(passedEvents);

        // Auto-select the first event
        if (passedEvents.length > 0) {
          setSelectedEvent(passedEvents[0]);
          fetchCompanyReport(passedEvents[0]._id);
        }
        
      } catch (error) {
        toast.error("Failed to load company events");
      }
    };
    
    fetchCompanyEvents();
  }, []);
  
  console.log(selectedEvent);
  // Fetch report for selected event
  const fetchCompanyReport = async (eventId) => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Dummy company report data with multiple employees
      const dummyCompanyReport = {
        eventId,
        eventInfo: {
          name: "2024 Annual Health Screening",
          date: "2024-05-15",
          location: "Company Headquarters"
        },
        participants: 45,
        summary: {
          averageBP: "122/78",
          averageGlucose: 5.2,
          averageCholesterol: 195,
          averageBMI: 24.1
        },
        employees: [
          {
            personalInfo: {
              fullName: "John Doe",
              idNumber: "ID123456",
              dob: "1985-05-15",
              gender: "Male",
              department: "Engineering"
            },
            healthInfo: {
              bloodPressure: { systolic: 120, diastolic: 80, category: "Normal" },
              glucose: { type: "Fasting", value: 5.0, category: "Normal" },
              cholesterol: { total: 180, hdl: 50, ldl: 100, triglycerides: 150, category: "Borderline High" },
              bmi: { height: 175, weight: 70, value: 22.9, category: "Normal" },
              hiv: { result: "Negative", testDate: "2024-05-15" }
            }
          },
          {
            personalInfo: {
              fullName: "Jane Smith",
              idNumber: "ID789012",
              dob: "1990-11-22",
              gender: "Female",
              department: "Marketing"
            },
            healthInfo: {
              bloodPressure: { systolic: 135, diastolic: 85, category: "High Stage 1" },
              glucose: { type: "Random", value: 6.8, category: "Prediabetes" },
              cholesterol: { total: 220, hdl: 45, ldl: 140, triglycerides: 180, category: "High" },
              bmi: { height: 165, weight: 72, value: 26.5, category: "Overweight" },
              hiv: { result: "Negative", testDate: "2024-05-15" }
            }
          },
          {
            personalInfo: {
              fullName: "Robert Johnson",
              idNumber: "ID345678",
              dob: "1978-03-10",
              gender: "Male",
              department: "Sales"
            },
            healthInfo: {
              bloodPressure: { systolic: 142, diastolic: 92, category: "High Stage 2" },
              glucose: { type: "Fasting", value: 7.5, category: "Diabetes" },
              cholesterol: { total: 240, hdl: 40, ldl: 160, triglycerides: 210, category: "Very High" },
              bmi: { height: 180, weight: 95, value: 29.3, category: "Overweight" },
              hiv: { result: "Negative", testDate: "2024-05-15" }
            }
          },
          {
            personalInfo: {
              fullName: "Emily Chen",
              idNumber: "ID901234",
              dob: "1993-07-18",
              gender: "Female",
              department: "HR"
            },
            healthInfo: {
              bloodPressure: { systolic: 118, diastolic: 76, category: "Normal" },
              glucose: { type: "Fasting", value: 4.8, category: "Normal" },
              cholesterol: { total: 170, hdl: 60, ldl: 90, triglycerides: 120, category: "Normal" },
              bmi: { height: 160, weight: 55, value: 21.5, category: "Normal" },
              hiv: { result: "Negative", testDate: "2024-05-15" }
            }
          },
          {
            personalInfo: {
              fullName: "Michael Brown",
              idNumber: "ID567890",
              dob: "1982-09-30",
              gender: "Male",
              department: "Operations"
            },
            healthInfo: {
              bloodPressure: { systolic: 128, diastolic: 82, category: "Elevated" },
              glucose: { type: "Random", value: 5.9, category: "Normal" },
              cholesterol: { total: 200, hdl: 45, ldl: 130, triglycerides: 160, category: "Borderline High" },
              bmi: { height: 178, weight: 85, value: 26.8, category: "Overweight" },
              hiv: { result: "Negative", testDate: "2024-05-15" }
            }
          }
        ],
        recommendations: `Based on the overall assessment of our employees' health:

1. 60% of employees have normal blood pressure, but 25% are in elevated or stage 1 hypertension. We recommend implementing a workplace hypertension awareness program.

2. 15% of employees show prediabetic or diabetic glucose levels. Consider offering nutritional counseling and diabetes prevention workshops.

3. Cholesterol levels are a concern with 40% of employees having borderline high or high cholesterol. We suggest promoting heart-healthy eating options in the cafeteria.

4. 45% of employees are overweight or obese. Launch a company-wide fitness challenge and provide gym membership subsidies.

5. All HIV tests came back negative. Continue promoting safe sex education and regular testing.`
      };

      // Calculate health status distribution
      dummyCompanyReport.employees.forEach(employee => {
        healthStatuses.bloodPressure[employee.healthInfo.bloodPressure.category]++;
        healthStatuses.glucose[employee.healthInfo.glucose.category]++;
        healthStatuses.cholesterol[employee.healthInfo.cholesterol.category]++;
        healthStatuses.bmi[employee.healthInfo.bmi.category]++;
        healthStatuses.hiv[employee.healthInfo.hiv.result]++;
      });

      dummyCompanyReport.healthDistribution = healthStatuses;
      setReport(dummyCompanyReport);
    } catch (error) {
      console.error("Error fetching company report:", error);
      toast.error("Failed to load company health report");
    } finally {
      setLoading(false);
    }
  };

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
      pdf.addImage(dataUrl, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), 0);
      pdf.save(`${selectedEvent.eventCode}_Event_Report.pdf`);
      toast.success("Company report downloaded as PDF!");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowEventDropdown(false);
    fetchCompanyReport(event._id);
  };

  if (loading && !report) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600">No events found for your company</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <ToastContainer position="top-right" />

      {/* Header with Event Selector and Download Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Event Selector */}
        <div className="relative w-full md:w-96">
          <button
            onClick={() => setShowEventDropdown(!showEventDropdown)}
            className="w-full flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <HiOutlineCalendar className="text-[#992787] w-5 h-5" />
              <span className="text-left">
                {selectedEvent ? (
                  <div>
                    <div className="font-medium">{selectedEvent.eventName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedEvent.eventDate).toLocaleDateString()} • {selectedEvent.venue}
                    </div>
                  </div>
                ) : (
                  "Select an event"
                )}
              </span>
            </div>
            <HiOutlineChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showEventDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showEventDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <ul className="py-1">
                {events.map((event) => (
                  <li key={event._id}>
                    <button
                      onClick={() => handleEventSelect(event)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${selectedEvent?._id === event._id ? "bg-purple-50" : ""
                        }`}
                    >
                      <div className="font-medium">{event.eventName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span>{event.eventCode}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting || !report}
          className={`flex items-center gap-2 px-4 py-6 rounded-lg ${isExporting || !report
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#992787] hover:bg-[#7a1f6e]"
            } text-white transition-colors w-full md:w-auto`}
        >
          <HiOutlineDownload className="w-5 h-5" />
          {isExporting ? "Exporting..." : "Download Report"}
        </button>
      </div>

      {/* Loading indicator when switching events */}
      {loading && report && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Main Report Content */}
      {report && !loading ? (
        <div ref={reportRef} className="space-y-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#992787] flex items-center justify-center gap-3">
              <HiOutlineUserGroup className="w-8 h-8" />
              {`Event Report for ${selectedEvent.eventName || "Selected Event" }`}
            </h2>
            <div className="mt-4 bg-[#f8f5fa] p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">{`Event Code : ${selectedEvent.eventCode || "N/A"}`}</h3>
              <p className="text-gray-600">
                {new Date(selectedEvent.eventDate).toLocaleDateString()} | {selectedEvent.venue}
              </p>
              <p className="mt-2 font-medium">
                Total Participants: <span className="text-[#992787]">{selectedEvent.numberOfAttendees} employees</span>
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#f9f9f9] p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#992787] mb-4 border-b pb-2">
              Executive Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Average Blood Pressure"
                value={report.summary.averageBP}
                description="Across all employees"
              />
              <SummaryCard
                title="Average Glucose"
                value={report.summary.averageGlucose}
                unit="mmol/L"
                description="Fasting glucose levels"
              />
              <SummaryCard
                title="Average Cholesterol"
                value={report.summary.averageCholesterol}
                unit="mg/dL"
                description="Total cholesterol"
              />
              <SummaryCard
                title="Average BMI"
                value={report.summary.averageBMI}
                description="Body Mass Index"
              />
            </div>
          </div>

          {/* Health Distribution */}
          <div className="bg-[#f9f9f9] p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#992787] mb-4 border-b pb-2">
              Health Status Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <DistributionCard
                title="Blood Pressure"
                data={report.healthDistribution.bloodPressure}
                total={report.participants}
              />
              <DistributionCard
                title="Glucose Levels"
                data={report.healthDistribution.glucose}
                total={report.participants}
              />
              <DistributionCard
                title="Cholesterol"
                data={report.healthDistribution.cholesterol}
                total={report.participants}
              />
              <DistributionCard
                title="Body Mass Index"
                data={report.healthDistribution.bmi}
                total={report.participants}
              />
              <DistributionCard
                title="HIV Status"
                data={report.healthDistribution.hiv}
                total={report.participants}
              />
            </div>
          </div>

          {/* Employee Health Overview */}
          <div className="bg-[#f9f9f9] p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#992787] mb-4 border-b pb-2">
              Employee Health Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glucose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cholesterol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.employees.map((employee, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{employee.personalInfo.fullName}</div>
                        <div className="text-sm text-gray-500">{employee.personalInfo.idNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.personalInfo.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <HealthStatusBadge
                          status={employee.healthInfo.bloodPressure.category}
                          value={`${employee.healthInfo.bloodPressure.systolic}/${employee.healthInfo.bloodPressure.diastolic}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <HealthStatusBadge
                          status={employee.healthInfo.glucose.category}
                          value={`${employee.healthInfo.glucose.value} mmol/L`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <HealthStatusBadge
                          status={employee.healthInfo.cholesterol.category}
                          value={`${employee.healthInfo.cholesterol.total} mg/dL`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <HealthStatusBadge
                          status={employee.healthInfo.bmi.category}
                          value={`${employee.healthInfo.bmi.value}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-[#f3e8f9] p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#992787] mb-4 border-b pb-2">
              Company Health Recommendations
            </h3>
            <div className="prose max-w-none p-4 bg-white rounded-lg">
              {report.recommendations.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
            <p>
              This report contains confidential health information intended only for authorized company representatives.
              Unauthorized disclosure is prohibited by law.
            </p>
            <p className="mt-2">
              Generated on {new Date().toLocaleDateString()} by Healthspace FMP Wellness
            </p>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Select an event to view its health report</p>
          </div>
        )
      )}
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ title, value, unit, description }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h4 className="text-sm font-medium text-gray-600">{title}</h4>
    <div className="flex items-baseline mt-1">
      <span className="text-2xl font-bold text-[#992787]">{value}</span>
      {unit && <span className="text-sm text-gray-600 ml-1">{unit}</span>}
    </div>
    <p className="mt-2 text-xs text-gray-500">{description}</p>
  </div>
);

const DistributionCard = ({ title, data, total }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h4 className="text-sm font-medium text-gray-600 mb-3">{title}</h4>
    <div className="space-y-2">
      {Object.entries(data).map(([status, count]) => (
        <div key={status} className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{status}</span>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-800 mr-2">{count}</span>
            <span className="text-xs text-gray-500">
              ({Math.round((count / total) * 100)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HealthStatusBadge = ({ status, value }) => {
  const getStatusColor = () => {
    const statusColors = {
      Normal: "bg-green-100 text-green-800",
      Negative: "bg-green-100 text-green-800",
      Elevated: "bg-yellow-100 text-yellow-800",
      Prediabetes: "bg-yellow-100 text-yellow-800",
      'Borderline High': "bg-yellow-100 text-yellow-800",
      Overweight: "bg-yellow-100 text-yellow-800",
      'High Stage 1': "bg-orange-100 text-orange-800",
      'High Stage 2': "bg-orange-100 text-orange-800",
      High: "bg-orange-100 text-orange-800",
      'Very High': "bg-red-100 text-red-800",
      Obesity: "bg-red-100 text-red-800",
      Diabetes: "bg-red-100 text-red-800",
      Positive: "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-blue-100 text-blue-800";
  };

  return (
    <div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </span>
      <div className="text-sm text-gray-600 mt-1">{value}</div>
    </div>
  );
};

export default UserReport;