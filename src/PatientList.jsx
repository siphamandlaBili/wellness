import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewAnswersModal, setViewAnswersModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState(null); // 'add' | 'questionnaire'
  const [newPatient, setNewPatient] = useState({ name: '', surname: '', email: '' });

  const questions = [
    'Do you have any allergies?',
    'Do you smoke?',
    'Do you exercise regularly?',
    'Have you had any surgeries?',
    'Are you currently taking any medications?',
    'Do you have a family history of chronic illnesses?',
    'Are you pregnant?',
    'Have you experienced any unexplained weight loss?',
    'Do you have a history of mental health issues?',
    'Do you have high blood pressure?',
  ];

  const fetchPatients = async () => {
    try {
      const res = await axios('https://wellness-temporary-db-2.onrender.com/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleLinkClick = (patient) => {
    setSelectedPatient(patient);
    setAnswers(Array(10).fill(''));
    setCurrentStep(0);
    setIsSubmitted(false);
    setMode('questionnaire');
    setShowForm(true);
  };

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
    setViewAnswersModal(true);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (currentStep === Math.ceil(questions.length / 5) - 1) {
      try {
        await axios.put(
          `https://wellness-temporary-db-2.onrender.com/patients/${selectedPatient.id}`,
          { answers }
        );
        setIsSubmitted(true);
        fetchPatients();
        setTimeout(() => {
          setShowForm(false);
          setMode(null);
        }, 1500);
      } catch (error) {
        console.error('Error submitting answers:', error);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleAddPatient = async () => {
    try {
      await axios.post('https://wellness-temporary-db-2.onrender.com/patients', newPatient);
      fetchPatients();
      setShowForm(false);
      setMode(null);
      setNewPatient({ name: '', surname: '', email: '' });
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const renderAddPatientForm = () => (
    <div className="fixed inset-0 bg-[#43404082] flex items-center justify-center z-50">
      <div className="bg-white max-w-[70vw] p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add New Patient</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Surname"
            value={newPatient.surname}
            onChange={(e) => setNewPatient({ ...newPatient, surname: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-between pt-4">
          <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={handleAddPatient} className="px-4 py-2 bg-[#992787] text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => {
    const start = currentStep * 5;
    const currentQuestions = questions.slice(start, start + 5);
    return currentQuestions.map((q, i) => (
      <div key={i} className="mb-4">
        <label className="block">{q}</label>
        <input
          type="text"
          value={answers[start + i]}
          onChange={(e) => handleAnswerChange(e, start + i)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    ));
  };

  const renderAnswersModal = () => (
    <div className="fixed  inset-0 bg-[#43404082] flex items-center justify-center z-50">
      <div className="bg-white max-w-[70vw] p-6 rounded shadow-md w-full overflow-yscroll max-w-md">
        <h2 className="text-lg font-bold mb-4">Health Questionnaire Answers</h2>
        <div className="space-y-4">
          {questions.map((question, i) => (
            <div key={i} className="mb-4">
              <label className="block">{question}</label>
              <div className="w-full border px-3 py-2 rounded">
                <span>{selectedPatient?.answers?.[i] || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-4">
          <button onClick={() => setViewAnswersModal(false)} className="px-4 py-2 bg-[#992787] text-white rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container p-4 max-w-5xl">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setMode('add');
            setShowForm(true);
          }}
          className="bg-[#992787] text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          + Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead className="bg-[#992787] text-white">
            <tr>
              <th className="py-2 px-4 text-left max-sm:hidden">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Surname</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Email</th>
              <th className="py-2 px-4 text-center">Questionnaire</th>
              <th className="py-2 px-4 text-left max-sm:hidden">View User</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b max-sm:hidden">{patient.id}</td>
                <td className="py-2 px-4 border-b">{patient.name}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{patient.surname}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{patient.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button onClick={() => handleLinkClick(patient)} className="text-blue-500 underline">
                    Link
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleViewClick(patient)} className="text-blue-500 underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient or Questionnaire Modal */}
      {showForm && mode === 'add' && renderAddPatientForm()}
      {showForm && mode === 'questionnaire' && selectedPatient && (
        <div className="fixed inset-0 bg-[#43404082] flex items-center justify-center z-50">
          <div className="bg-white max-w-[70vw] p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Health Questionnaire for {selectedPatient.name}</h2>
            <div className="space-y-4">{renderQuestions()}</div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#992787] text-white rounded">
                {currentStep === Math.ceil(questions.length / 5) - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
            {isSubmitted && (
              <div className="text-center mt-4">
                <div className="text-3xl text-green-500">
                  <span className="animate-bounce">✔️</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Thank you for completing the questionnaire!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Answers Modal */}
      {viewAnswersModal && renderAnswersModal()}
    </div>
  );
};

export default PatientList;
