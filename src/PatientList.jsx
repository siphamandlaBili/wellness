import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineHeart,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineUserAdd,
  HiOutlineDocumentAdd,
  HiOutlineEye
} from 'react-icons/hi';

const formSteps = [
  {
    title: "Patient Registration",
    fields: [
      { name: 'fullName', label: 'Full Name', icon: HiOutlineUser, required: true },
      { name: 'surname', label: 'Surname', icon: HiOutlineUser, required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'idNumber', label: 'ID Number', required: true },
      { name: 'email', label: 'Email', type: 'email', icon: HiOutlineMail, required: true },
      { name: 'cellPhone', label: 'Cell Phone', type: 'tel', icon: HiOutlinePhone, required: true },
    ]
  },
  {
    title: "Medical Aid Details",
    fields: [
      { name: 'schemeName', label: 'Scheme Name' },
      { name: 'planOption', label: 'Plan/Option' },
      { name: 'membershipNumber', label: 'Membership Number' },
      { name: 'mainMemberNames', label: 'Main Member Names' },
      { name: 'mainMemberAddress', label: 'Main Member Address', type: 'textarea' },
      {
        name: 'dependentCode',
        label: 'Dependent Code',
        type: 'select',
        options: Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'))
      }
    ]
  },
  {
    title: "Consent Agreement",
    fields: [
      { name: 'consent', label: 'Digital Signature', type: 'signature', required: true }
    ]
  },
  {
    title: "Medical Screening",
    fields: [
      { name: 'bmi', label: 'BMI', type: 'number' },
      { name: 'cholesterol', label: 'Cholesterol (mg/dL)', type: 'number' },
      { name: 'hiv', label: 'HIV Screening Result', type: 'select', options: ['Negative', 'Positive', 'Inconclusive'] },
      { name: 'glucose', label: 'Glucose Level (mg/dL)', type: 'number' },
    ]
  }
];

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    surname: '',
    dateOfBirth: '',
    idNumber: '',
    email: '',
    cellPhone: '',
    schemeName: '',
    planOption: '',
    membershipNumber: '',
    mainMemberNames: '',
    mainMemberAddress: '',
    dependentCode: '',
    bmi: '',
    cholesterol: '',
    hiv: '',
    glucose: '',
  });
  const [signature, setSignature] = useState('');
  const [questions, setQuestions] = useState([
    { question: "How often do you feel anxious?", answer: '' },
    { question: "Do you have trouble sleeping?", answer: '' },
  ]);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralComment, setReferralComment] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('https://wellness-temporary-db-2.onrender.com/patients');
        setPatients(res.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        alert('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async () => {
    try {
      const patientData = {
        ...newPatient,
        id: patients.length + 1,
        signature,
        questions,
        createdAt: new Date().toISOString()
      };

      setPatients(prev => [...prev, patientData]);
      setShowForm(false);
      setCurrentStep(0);
      setNewPatient({
        fullName: '',
        surname: '',
        dateOfBirth: '',
        idNumber: '',
        email: '',
        cellPhone: '',
        schemeName: '',
        planOption: '',
        membershipNumber: '',
        mainMemberNames: '',
        mainMemberAddress: '',
        dependentCode: '',
        bmi: '',
        cholesterol: '',
        hiv: '',
        glucose: '',
      });
      setSignature('');
      setQuestions([]);
      alert('Patient registered successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient');
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSignatureClear = () => {
    setSignature('');
  };

  const handleAddReferral = () => {
    if (!referralComment.trim()) {
      alert('Please enter referral comments');
      return;
    }

    const referralData = {
      id: selectedPatient.id,
      name: selectedPatient.fullName,
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
    <div className="min-h-screen p-6 bg-gray-50">
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
                  <th className="p-4 text-left text-[#992787] font-semibold">Patient Name</th>
                  <th className="p-4 text-left text-[#992787] font-semibold max-md:hidden">Contact Info</th>
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
                      <div className="font-medium text-gray-900">{patient.fullName}</div>
                      <div className="text-sm text-gray-500">{patient.surname}</div>
                    </td>
                    <td className="p-4 max-md:hidden">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <HiOutlineMail className="w-4 h-4 text-[#992787]" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <HiOutlinePhone className="w-4 h-4 text-[#992787]" />
                          {patient.cellPhone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowReferralForm(true);
                          }}
                          className="text-[#992787] hover:text-[#7a1f6e] p-2"
                        >
                          <HiOutlineDocumentAdd className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDetails(patient);
                            setShowDetails(true);
                          }}
                          className="text-[#992787] hover:text-[#7a1f6e] p-2"
                        >
                          <HiOutlineEye className="w-5 h-5" />
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
          <div className="fixed inset-0 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white overflow-auto rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl">
              <div className="flex overflow-y-auto justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787]">
                  {formSteps[currentStep].title}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 flex justify-center gap-2">
                {formSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-[#992787]' : 'bg-gray-300'}`}
                  />
                ))}
              </div>

              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formSteps[0].fields.map((field) => (
                    <div key={field.name} className="relative">
                      {field.icon && <field.icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />}
                      <input
                        type={field.type || 'text'}
                        placeholder={field.label}
                        value={newPatient[field.name]}
                        onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                        className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-lg`}
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {formSteps[1].fields.map((field) => (
                    <div key={field.name} className="relative">
                      {field.type === 'select' ? (
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.label}
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={field.label}
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Consent Agreement</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      I hereby consent to participate in the screening process and authorize
                      the secure storage and sharing of my medical information with authorized
                      wellness professionals in compliance with POPIA regulations.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 w-full h-32 rounded-lg flex items-center justify-center">
                      {signature ? (
                        <img
                          src={signature}
                          alt="Signature"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400">Sign here</p>
                      )}
                    </div>
                    <button
                      onClick={handleSignatureClear}
                      className="mt-2 text-sm text-[#992787] hover:text-[#7a1f6e]"
                    >
                      Clear Signature
                    </button>
                  </div>
                </div>
              )}

              {
                currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* BMI Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">BMI</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                          value={newPatient.bmi}
                          onChange={(e) => setNewPatient({ ...newPatient, bmi: e.target.value })}
                        />
                      </div>

                      {/* Cholesterol Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Cholesterol (mg/dL)</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                          value={newPatient.cholesterol}
                          onChange={(e) => setNewPatient({ ...newPatient, cholesterol: e.target.value })}
                        />
                      </div>

                      {/* Glucose Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Glucose Level (mg/dL)</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                          value={newPatient.glucose}
                          onChange={(e) => setNewPatient({ ...newPatient, glucose: e.target.value })}
                        />
                      </div>

                      {/* HIV Screening */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">HIV Screening Result</label>
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                          value={newPatient.hiv}
                          onChange={(e) => setNewPatient({ ...newPatient, hiv: e.target.value })}
                        >
                          <option value="">Select Result</option>
                          {['Negative', 'Positive', 'Inconclusive'].map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Mental Health Assessment Section */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Additional Health Questions</h3>
                      {questions.map((q, index) => (
                        <div key={index} className="mb-4 space-y-2">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Enter health question"
                              value={q.question}
                              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                              className="flex-1 px-4 py-2 border rounded-lg"
                            />
                            <button
                              onClick={() => {
                                const newQuestions = [...questions];
                                newQuestions.splice(index, 1);
                                setQuestions(newQuestions);
                              }}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <HiOutlineX className="w-5 h-5" />
                            </button>
                          </div>
                          <textarea
                            placeholder="Patient's response"
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            rows={2}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => setQuestions([...questions, { question: '', answer: '' }])}
                        className="flex items-center gap-2 text-[#992787] hover:text-[#7a1f6e] text-sm"
                      >
                        <HiOutlinePlus className="w-5 h-5" />
                        Add Custom Question
                      </button>
                    </div>
                  </div>
                )
              }

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-2 text-gray-600 disabled:opacity-50"
                >
                  <HiOutlineArrowLeft className="inline mr-2" /> Back
                </button>

                <button
                  onClick={() => {
                    if (currentStep === formSteps.length - 1) {
                      handleAddPatient();
                    } else {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  className="px-6 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e]"
                >
                  {currentStep === formSteps.length - 1 ? 'Submit' : 'Next'}
                  <HiOutlineArrowRight className="inline ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetails && selectedDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl relative max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787]">
                  Patient Details - {selectedDetails.fullName}
                </h2>
                <button onClick={() => setShowDetails(false)}>
                  <HiOutlineX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto pr-4 -mr-4"> {/* Add scrollable container */}
                <div className="grid grid-cols-2 gap-4 pb-4"> {/* Add padding bottom */}
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Personal Information</h3>
                    <p>ID: {selectedDetails.idNumber}</p>
                    <p>Date of Birth: {new Date(selectedDetails.dateOfBirth).toLocaleDateString()}</p>
                    <p>Email: {selectedDetails.email}</p>
                    <p>Phone: {selectedDetails.cellPhone}</p>
                  </div>

                  {/* Medical Aid Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Medical Aid Details</h3>
                    <p>Scheme: {selectedDetails.schemeName || 'N/A'}</p>
                    <p>Plan: {selectedDetails.planOption || 'N/A'}</p>
                    <p>Member #: {selectedDetails.membershipNumber || 'N/A'}</p>
                    <p>Main Member: {selectedDetails.mainMemberNames || 'N/A'}</p>
                    <p>Address: {selectedDetails.mainMemberAddress || 'N/A'}</p>
                    <p>Dependent Code: {selectedDetails.dependentCode || 'N/A'}</p>
                  </div>

                  {/* Medical Information */}
                  <div className="col-span-2 space-y-2">
                    <h3 className="font-semibold">Medical Information</h3>
                    <p>BMI: {selectedDetails.bmi}</p>
                    <p>Cholesterol: {selectedDetails.cholesterol} mg/dL</p>
                    <p>HIV Status: {selectedDetails.hiv}</p>
                    <p>Glucose: {selectedDetails.glucose} mg/dL</p>
                  </div>

                  {/* Mental Health Assessment */}
                  <div className="col-span-2">
                    <h3 className="font-semibold mt-4">Mental Health Assessment</h3>
                    {selectedDetails.questions?.map((q, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium">{q.question}</p>
                        <p className="text-gray-600">{q.answer || 'No response'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Signature */}
                  {selectedDetails.signature && (
                    <div className="col-span-2 mt-4">
                      <h3 className="font-semibold">Consent Signature</h3>
                      <img
                        src={selectedDetails.signature}
                        alt="Consent signature"
                        className="w-48 h-32 border-2 border-gray-200 object-contain"
                      />
                    </div>
                  )}
                </div>
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
                  New Referral for {selectedPatient.fullName}
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
                    Referral Comments
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