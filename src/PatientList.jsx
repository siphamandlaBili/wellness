import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineUserAdd,
  HiOutlineDocumentAdd
} from 'react-icons/hi';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
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
      alert('Failed to load patients');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    try {
      const newPatientData = { 
        ...newPatient, 
        id: patients.length + 1,
        phone: 'N/A' // Add default phone number
      };
      setPatients(prev => [...prev, newPatientData]);
      setShowForm(false);
      setNewPatient({ name: '', surname: '', email: '' });
      alert('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient');
    }
  };

  const handleAddReferral = () => {
    if (!referralComment.trim()) {
      alert('Please enter referral comments');
      return;
    }

    const referralData = {
      id: selectedPatient.id,
      name: selectedPatient.name,
      email: selectedPatient.email,
      referralComment,
      date: new Date().toISOString()
    };

    const existingReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    localStorage.setItem('referrals', JSON.stringify([...existingReferrals, referralData]));
    
    setPatients(prev => prev.filter(patient => patient.id !== selectedPatient.id));
    setShowReferralForm(false);
    setReferralComment('');
    setSelectedPatient(null);
    
    alert('Referral added successfully!');
    navigate('/nurse/referrals');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#992787]">
            Patient Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#992787] text-white rounded-xl hover:bg-[#7a1f6e] transition-all"
          >
            <HiOutlineUserAdd className="w-5 h-5" />
            Add New Patient
          </button>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#992787]/10">
                <tr>
                  <th className="p-4 text-left text-[#992787] font-semibold">Patient Details</th>
                  <th className="p-4 text-left text-[#992787] font-semibold max-md:hidden">Contact Information</th>
                  <th className="p-4 text-center text-[#992787] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.surname}</div>
                    </td>
                    <td className="p-4 max-md:hidden">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <HiOutlineMail className="w-4 h-4 text-[#992787]" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowReferralForm(true);
                          }}
                          className="flex items-center gap-2 text-[#992787] hover:text-[#7a1f6e] px-4 py-2 rounded-lg hover:bg-purple-50"
                        >
                          <HiOutlineDocumentAdd className="w-5 h-5" />
                          <span className="hidden sm:inline">Create Referral</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Patient Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787]">New Patient Registration</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/20"
                  />
                </div>
                
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newPatient.surname}
                    onChange={(e) => setNewPatient({ ...newPatient, surname: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/20"
                  />
                </div>
                
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleAddPatient}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors"
                >
                  Register Patient
                  <HiOutlineArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Referral Modal */}
        {showReferralForm && selectedPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787]">
                  New Referral for {selectedPatient.name}
                </h2>
                <button 
                  onClick={() => setShowReferralForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Patient ID</p>
                      <p className="font-medium">{selectedPatient.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedPatient.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Clinical Notes
                  </label>
                  <textarea
                    placeholder="Enter detailed referral comments..."
                    value={referralComment}
                    onChange={(e) => setReferralComment(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#992787] focus:ring-2 focus:ring-[#992787]/20 h-40 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleAddReferral}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition-colors"
                >
                  Submit Referral
                  <HiOutlineArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;