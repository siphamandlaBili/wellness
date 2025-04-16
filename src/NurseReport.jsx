import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineUser, HiOutlineClipboardList, HiOutlineAnnotation } from 'react-icons/hi';

// Dummy Data
const dummyPatients = [
  {
    id: 1,
    name: "John Doe",
    bloodPressure: "130/85",
    bmi: 25.4,
    cholesterol: "200",
    glucose: "5.8",
    hba1c: "5.9",
    hiv: "Negative",
    dateOfBirth: "1985-04-23",
    cellPhone: "+27 123 456 789"
  },
  {
    id: 2,
    name: "Jane Smith",
    bloodPressure: "145/95",
    bmi: 28.7,
    cholesterol: "220",
    glucose: "6.7",
    hba1c: "6.1",
    hiv: "Negative",
    dateOfBirth: "1990-11-15",
    cellPhone: "+27 987 654 321"
  }
];

const dummyOpinions = [
  {
    id: 1,
    content: "Patient shows signs of pre-diabetes, recommend lifestyle changes.",
    author: "Dr. Sarah Johnson",
    date: "2023-08-01"
  }
];

const ReportPage = ({ role }) => {
  const [patients] = useState(dummyPatients);
  const [medicalOpinions, setMedicalOpinions] = useState(dummyOpinions);
  const [newOpinion, setNewOpinion] = useState('');

  // Statistics calculations
  const averageBMI = patients.reduce((acc, p) => acc + (p.bmi || 0), 0) / patients.length || 0;
  
  const bloodPressureStats = patients.reduce((acc, p) => {
    const [systolic, diastolic] = p.bloodPressure.split('/').map(Number);
    if (systolic < 120 && diastolic < 80) acc.normal++;
    else if (systolic < 139 && diastolic < 89) acc.elevated++;
    else acc.high++;
    return acc;
  }, { normal: 0, elevated: 0, high: 0 });

  const hba1cStats = patients.reduce((acc, p) => {
    const val = parseFloat(p.hba1c);
    if (val < 5.7) acc.normal++;
    else if (val < 6.5) acc.prediabetes++;
    else acc.diabetes++;
    return acc;
  }, { normal: 0, prediabetes: 0, diabetes: 0 });

  const handleOpinionSubmit = () => {
    if (!newOpinion.trim()) {
      toast.error('Please enter an opinion before submitting');
      return;
    }

    const newEntry = {
      id: medicalOpinions.length + 1,
      content: newOpinion,
      author: "Nurse Name",
      date: new Date().toISOString().split('T')[0]
    };

    setMedicalOpinions([...medicalOpinions, newEntry]);
    setNewOpinion('');
    toast.success('Opinion submitted successfully');
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
            title="Average BMI" 
            value={averageBMI.toFixed(1)}
            color={getBmiColor(averageBMI)}
          />
          <StatCard 
            title="Normal BP" 
            value={bloodPressureStats.normal}
            color="bg-green-100 text-green-800"
          />
          <StatCard 
            title="High HbA1c" 
            value={hba1cStats.diabetes}
            color="bg-red-100 text-red-800"
          />
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HealthMetricChart
            title="Blood Pressure Distribution"
            data={[
              { label: 'Normal', value: bloodPressureStats.normal, color: 'bg-green-500' },
              { label: 'Elevated', value: bloodPressureStats.elevated, color: 'bg-yellow-500' },
              { label: 'High', value: bloodPressureStats.high, color: 'bg-red-500' },
            ]}
          />
          
          <HealthMetricChart
            title="HbA1c Levels"
            data={[
              { label: 'Normal', value: hba1cStats.normal, color: 'bg-green-500' },
              { label: 'Prediabetes', value: hba1cStats.prediabetes, color: 'bg-yellow-500' },
              { label: 'Diabetes', value: hba1cStats.diabetes, color: 'bg-red-500' },
            ]}
          />
        </div>

        {/* Medical Opinions Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HiOutlineAnnotation className="w-6 h-6" />
            {role === 'nurse' ? 'Add Medical Opinion' : 'Medical Opinions'}
          </h2>

          {role === 'nurse' ? (
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
                  <p className="text-gray-700 whitespace-pre-wrap">{opinion.content}</p>
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
const StatCard = ({ title, value, icon, color = 'bg-gray-100' }) => (
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
  const maxValue = Math.max(...data.map(d => d.value)) || 1;
  
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
  if (typeof bmi !== 'number') return 'bg-gray-100 text-gray-800';
  if (bmi < 18.5) return 'bg-blue-100 text-blue-800';
  if (bmi < 25) return 'bg-green-100 text-green-800';
  if (bmi < 30) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const NurseReport = () => <ReportPage role="nurse" />;
export const AdminReport = () => <ReportPage role="admin" />;