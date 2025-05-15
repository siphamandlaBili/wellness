import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineAnnotation,
} from "react-icons/hi";
import { Bar } from "react-chartjs-2";
import PieChart from "../../components/PieChart";
import {
  calculateAgeStats,
  calculateSexStats,
  calculateBloodPressureStats,
  calculateBmiStats,
  calculateHba1cStats,
  calculateCholesterolStats,
  calculateHivStats,
  calculateGlucoseStats,
} from "../../utils/statsUtils";
import {
  calculateAverageBloodPressure,
  calculateAverageBmi,
  calculateAverageCholesterol,
  calculateAverageHba1c,
  calculateAverageGlucose,
} from "../../utils/averageUtils";

const ReportPage = ({ role }) => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      medicalInfo: {
        bloodPressure: "120/80",
        bmi: 22.5,
        hba1c: 5.6,
        cholesterol: 180,
        hiv: "Negative",
        glucoseType: "Fasting",
        sex: "Male",
        age: 30,
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      medicalInfo: {
        bloodPressure: "140/90",
        bmi: 27.8,
        hba1c: 6.2,
        cholesterol: 220,
        hiv: "Positive",
        glucoseType: "Random",
        sex: "Female",
        age: 45,
      },
    },
    {
      id: 3,
      name: "Alice Johnson",
      medicalInfo: {
        bloodPressure: "110/70",
        bmi: 18.4,
        hba1c: 5.4,
        cholesterol: 250,
        hiv: "Inconclusive",
        glucoseType: "Postprandial",
        sex: "Female",
        age: 25,
      },
    },
    {
      id: 4,
      name: "Bob Brown",
      medicalInfo: {
        bloodPressure: "160/100",
        bmi: 32.1,
        hba1c: 7.1,
        cholesterol: 300,
        hiv: "Negative",
        glucoseType: "Fasting",
        sex: "Male",
        age: 55,
      },
    },
    {
      id: 5,
      name: "Charlie Davis",
      medicalInfo: {
        bloodPressure: "130/85",
        bmi: 24.9,
        hba1c: 5.8,
        cholesterol: 190,
        hiv: "Positive",
        glucoseType: "Random",
        sex: "Male",
        age: 40,
      },
    },
  ]);
  const [medicalOpinions, setMedicalOpinions] = useState([]);
  const [newOpinion, setNewOpinion] = useState("");

  // Fetch patient data from backend
  // useEffect(() => {
  //   const fetchPatients = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://wellness-temporary-db-2.onrender.com/patients"
  //       );
  //       setPatients(response.data);
  //     } catch (error) {
  //       console.error("Error fetching patients:", error);
  //       toast.error("Failed to load patient data");
  //     }
  //   };

  //   fetchPatients();
  // }, []);

  //Statistics
  const bloodPressureStats = calculateBloodPressureStats(patients);
  const bmiStats = calculateBmiStats(patients);
  const hba1cStats = calculateHba1cStats(patients);
  const cholesterolStats = calculateCholesterolStats(patients);
  const hivStats = calculateHivStats(patients);
  const glucoseStats = calculateGlucoseStats(patients);
  const sexStats = calculateSexStats(patients);
  const ageStats = calculateAgeStats(patients);

  // Averages
  const averageBloodPressure = calculateAverageBloodPressure(patients);
  const averageBmi = calculateAverageBmi(patients);
  const averageCholesterol = calculateAverageCholesterol(patients);
  const averageHba1c = calculateAverageHba1c(patients);
  const averageGlucose = calculateAverageGlucose(patients);

  //  Pie Chart Data
  const bloodPressurePieData = {
    labels: ["Normal", "Elevated", "High"],
    datasets: [
      {
        data: [
          bloodPressureStats.normal,
          bloodPressureStats.elevated,
          bloodPressureStats.high,
        ],
        backgroundColor: ["#81c784", "#ffb74d", "#e57373"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const bmiPieData = {
    labels: ["Underweight", "Normal", "Overweight", "Obese"],
    datasets: [
      {
        data: [
          bmiStats.underweight,
          bmiStats.normal,
          bmiStats.overweight,
          bmiStats.obese,
        ],
        backgroundColor: ["#4fc3f7", "#81c784", "#ffb74d", "#e57373"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const hba1cPieData = {
    labels: ["Normal", "Prediabetes", "Diabetes"],
    datasets: [
      {
        data: [hba1cStats.normal, hba1cStats.prediabetes, hba1cStats.diabetes],
        backgroundColor: ["#81c784", "#ffb74d", "#e57373"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const cholesterolPieData = {
    labels: ["Normal (<200)", "Borderline (200-239)", "High (≥240)"],
    datasets: [
      {
        data: [
          cholesterolStats.normal,
          cholesterolStats.borderline,
          cholesterolStats.high,
        ],
        backgroundColor: ["#81c784", "#ffb74d", "#e57373"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data
  const glucoseBarData = {
    labels: ["Fasting", "Random", "Postprandial", "Unknown"],
    datasets: [
      {
        label: "Glucose Levels",
        data: [
          glucoseStats.fasting,
          glucoseStats.random,
          glucoseStats.postprandial,
          glucoseStats.unknown,
        ],
        backgroundColor: ["#4fc3f7", "#ffb74d", "#e57373", "#bdbdbd"],
      },
    ],
  };

  const hivBarData = {
    labels: ["Negative", "Positive", "Inconclusive", "Unknown"],
    datasets: [
      {
        label: "HIV Status",
        data: [
          hivStats.negative,
          hivStats.positive,
          hivStats.inconclusive,
          hivStats.unknown,
        ],
        backgroundColor: ["#81c784", "#e57373", "#ffb74d", "#bdbdbd"],
      },
    ],
  };

  const handleOpinionSubmit = () => {
    if (!newOpinion.trim()) {
      toast.error("Please enter an opinion before submitting");
      return;
    }

    const newEntry = {
      id: medicalOpinions.length + 1,
      content: newOpinion,
      author: "Nurse Name",
      date: new Date().toISOString().split("T")[0],
    };

    setMedicalOpinions([...medicalOpinions, newEntry]);
    setNewOpinion("");
    toast.success("Opinion submitted successfully");
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#9927a6] mb-8 flex items-center gap-2">
          Patient Health Analytics
        </h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<HiOutlineUser className="w-6 h-6" />}
          />

          <StatCard
            title="Average Blood Pressure"
            value={averageBloodPressure}
            color="bg-blue-100 text-blue-800"
            icon={<HiOutlineClipboardList className="w-6 h-6" />}
          />

          <StatCard
            title="Average BMI"
            value={averageBmi}
            color="bg-green-100 text-green-800"
            icon={<HiOutlineClipboardList className="w-6 h-6" />}
          />

          <StatCard
            title="Average HbA1c"
            value={`${averageHba1c}%`}
            color="bg-red-100 text-red-800"
            icon={<HiOutlineClipboardList className="w-6 h-6" />}
          />

          <StatCard
            title="Average Cholesterol"
            value={`${averageCholesterol} mg/dL`}
            color="bg-yellow-100 text-yellow-800"
            icon={<HiOutlineClipboardList className="w-6 h-6" />}
          />
          <StatCard
            title="Average Glucose"
            value={`${averageGlucose} mmol/L`}
            color="bg-purple-100 text-purple-800"
            icon={<HiOutlineClipboardList className="w-6 h-6" />}
          />
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sex Pie chart */}
          <PieChart
            title="Sex Distribution"
            data={{
              labels: ["Male", "Female", "Unknown"],
              datasets: [
                {
                  data: [sexStats.male, sexStats.female, sexStats.unknown],
                  backgroundColor: ["#4fc3f7", "#ffb74d", "#bdbdbd"],
                  borderColor: "white",
                  borderWidth: 2,
                },
              ],
            }}
          />
          {/* age pie chart */}
          <PieChart
            title="Age Distribution"
            data={{
              labels: [
                "Adults (18-39)",
                "Middle-Aged (40-59)",
                "Seniors (60+)",
              ],
              datasets: [
                {
                  data: [
                    ageStats.adults,
                    ageStats.middleAged,
                    ageStats.seniors,
                  ],
                  backgroundColor: ["#4fc3f7", "#81c784", "#ffb74d", "#e57373"],
                  borderColor: "white",
                  borderWidth: 2,
                },
              ],
            }}
          />
          {/* Blood Pressure Pie Chart */}
          <PieChart
            title="Blood Pressure Distribution"
            data={bloodPressurePieData}
          />

          {/* BMI Distribution Pie Chart */}
          <PieChart title="BMI Distribution" data={bmiPieData} />

          {/* HbA1c Distribution Pie Chart */}
          <PieChart title="HbA1c Distribution" data={hba1cPieData} />

          <PieChart
            title="Cholesterol Distribution"
            data={cholesterolPieData}
          />

          {/* Glucose Level Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">
              Glucose Level Distribution
            </h3>
            <Bar
              data={{
                labels: ["Fasting", "Random", "Postprandial", "Unknown"],
                datasets: [
                  {
                    label: "Glucose Levels",
                    data: [
                      glucoseStats.fasting,
                      glucoseStats.random,
                      glucoseStats.postprandial,
                      glucoseStats.unknown,
                    ],
                    backgroundColor: [
                      "#4fc3f7",
                      "#ffb74d",
                      "#e57373",
                      "#bdbdbd",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: "Glucose Type" } },
                  y: { title: { display: true, text: "Number of Patients" } },
                },
              }}
            />
          </div>

          {/* HIV Status Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">
              HIV Status Distribution
            </h3>
            <Bar
              data={hivBarData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: "HIV Status" } },
                  y: { title: { display: true, text: "Number of Patients" } },
                },
              }}
            />
          </div>
        </div>

        {/* Medical Opinions Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HiOutlineAnnotation className="w-6 h-6" />
            {role === "nurse" ? "Add Medical Opinion" : "Medical Opinions"}
          </h2>

          {role === "nurse" ? (
            <div className="space-y-4">
              <textarea
                value={newOpinion}
                onChange={(e) => setNewOpinion(e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your professional opinion..."
                rows="4"
              />
              <button
                onClick={handleOpinionSubmit}
                className="bg-[#9927a6] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Opinion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalOpinions.map((opinion) => (
                <div key={opinion.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="font-medium">{opinion.author}</span>
                    <span>{new Date(opinion.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {opinion.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon, color = "bg-gray-100" }) => (
  <div className={`p-4 rounded-xl ${color} transition-all hover:scale-[1.02]`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="text-gray-500">{icon}</div>
    </div>
  </div>
);

const HealthMetricChart = ({ title, data }) => {
  const maxValue = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-4 text-lg text-gray-800">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="w-24 flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="w-12 text-right font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper Functions
const getBmiColor = (bmi) => {
  if (typeof bmi !== "number") return "bg-gray-100 text-gray-800";
  if (bmi < 18.5) return "bg-blue-100 text-blue-800";
  if (bmi < 25) return "bg-green-100 text-green-800";
  if (bmi < 30) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export const NurseReport = () => <ReportPage role="nurse" />;
export const AdminReport = () => <ReportPage role="admin" />;
