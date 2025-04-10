import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', surname: 'Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', surname: 'Smith', email: 'jane.smith@example.com' },
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', surname: '', email: '' });
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralComment, setReferralComment] = useState('');
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await axios.get('https://wellness-temporary-db-2.onrender.com/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    try {
      const newPatientData = { ...newPatient, id: patients.length + 1 };
      setPatients((prev) => [...prev, newPatientData]);
      setShowForm(false);
      setNewPatient({ name: '', surname: '', email: '' });
      alert('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const handleAddReferral = () => {
    const referralData = {
      id: selectedPatient.id,
      name: selectedPatient.name,
      email: selectedPatient.email,
      referralComment,
    };

    // Save referral data to localStorage (mocking backend)
    const existingReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    localStorage.setItem('referrals', JSON.stringify([...existingReferrals, referralData]));

    // Remove patient from the list
    setPatients((prev) => prev.filter((patient) => patient.id !== selectedPatient.id));

    // Close the referral form and navigate to the Referrals page
    setShowReferralForm(false);
    setReferralComment('');
    setSelectedPatient(null);
    alert('Referral added successfully!');
    navigate('/nurse/referrals');
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

  return (
    <div className="container p-4 max-w-5xl">
      <h2 className="text-2xl font-bold text-[#992787] mb-6">Patient List</h2>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#992787] text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          + Add Patient
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead className="bg-[#992787] text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Surname</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="text-gray-700">
                <td className="py-2 px-4 border-b">{patient.name}</td>
                <td className="py-2 px-4 border-b">{patient.surname}</td>
                <td className="py-2 px-4 border-b">{patient.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowReferralForm(true);
                    }}
                    className="text-blue-500 underline"
                  >
                    Add Referral
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Form */}
      {showForm && renderAddPatientForm()}

      {/* Referral Form */}
      {showReferralForm && (
        <div className="fixed inset-0 bg-[#43404082] flex items-center justify-center z-50">
          <div className="bg-white max-w-[70vw] p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Referral for {selectedPatient?.name}</h2>
            <textarea
              placeholder="Enter referral comment"
              value={referralComment}
              onChange={(e) => setReferralComment(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowReferralForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReferral}
                className="px-4 py-2 bg-[#992787] text-white rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
