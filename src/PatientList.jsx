import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineUserAdd,
  HiOutlineDocumentAdd,
  HiOutlineEye,
  HiOutlineSearch
} from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formSteps = [
  {
    title: "Patient Registration",
    fields: [
      { name: 'name', label: 'Full Name', icon: HiOutlineUser, required: true },
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
        options: Array.from({ length: 10 }, (_, i) => (i).toString().padStart(2, '0'))
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
      { name: 'height', label: 'Height (cm)', type: 'number' },
      { name: 'weight', label: 'Weight (kg)', type: 'number' },
      { name: 'cholesterol', label: 'Cholesterol (mg/dL)', type: 'number' },
      { name: 'hiv', label: 'HIV Screening Result', type: 'select', options: ['Negative', 'Positive', 'Inconclusive'] },
      { name: 'glucose', label: 'Glucose Level (mg/dL)', type: 'number' },
    ]
  },
  {
    title: "Additional Health Questions",
    fields: []
  }
];

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPatients, setCurrentPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newPatient, setNewPatient] = useState({
    name: '',
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
    height: '',
    weight: '',
    bmi:"",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('https://wellness-temporary-db-2.onrender.com/patients');
        setPatients(res.data);
        setFilteredPatients(res.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient => {
      const searchLower = searchTerm.toLowerCase();
      return (
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.surname?.toLowerCase().includes(searchLower) ||
        patient.idNumber?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentPatients(filteredPatients.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, filteredPatients, itemsPerPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const calculateBMI = (height, weight) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0) return null;
    return Math.round((w / ((h / 100) ** 2)) * 10) / 10;
  };

  const getBmiColor = (bmi) => {
    if (bmi === undefined || bmi === null || bmi === '') return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    const numericBmi = typeof bmi === 'string' ? parseFloat(bmi) : bmi;
    if (numericBmi < 17) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    if (numericBmi < 18.5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    if (numericBmi < 25) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    if (numericBmi < 30) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
  };

  const handleAddPatient = async () => {
    try {
      const bmiCalc = calculateBMI(newPatient.height, newPatient.weight);
      
      const patientData = {
        ...newPatient,
        id: patients.length + 1,
        bmi:bmiCalc,
        signature,
        questions,
        createdAt: new Date().toISOString()
      };

      setPatients(prev => [...prev, patientData]);
      setFilteredPatients(prev => [...prev, patientData]);
      setShowForm(false);
      setCurrentStep(0);
      setNewPatient({
        name: '',
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
        bmi:bmiCalc,
        cholesterol: '',
        hiv: '',
        glucose: '',
      });
      setSignature('');
      setQuestions([]);
      console.log(newPatient);
      toast.success('Patient registered successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient');
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
      toast.error('Please enter referral comments');
      return;
    }

    const referralData = {
      id: selectedPatient.id,
      name: selectedPatient.name,
      surname: selectedPatient.surname,
      email: selectedPatient.email,
      referralComment,
      date: new Date().toISOString()
    };

    const existingReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
    localStorage.setItem('referrals', JSON.stringify([...existingReferrals, referralData]));

    setPatients(prev => prev.filter(patient => patient.id !== selectedPatient.id));
    setFilteredPatients(prev => prev.filter(patient => patient.id !== selectedPatient.id));
    setShowReferralForm(false);
    setReferralComment('');
    setSelectedPatient(null);

    toast.success('Referral added successfully!');
    navigate('/nurse/referrals');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#992787] dark:text-purple-400">
            Patient Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#992787] dark:bg-purple-600 text-white rounded-xl hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-all"
          >
            <HiOutlineUserAdd className="w-5 h-5" />
            Add New Patient
          </button>
        </div>

        <div className="mb-6 relative">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search patients by name, surname, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {currentPatients.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <HiOutlineUser className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">No patients found matching your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#992787]/10 dark:bg-purple-900/20">
                  <tr>
                    <th className="p-4 text-left text-[#992787] dark:text-purple-400 font-semibold">Patient Name</th>
                    <th className="p-4 text-left text-[#992787] dark:text-purple-400 font-semibold max-md:hidden">Contact Info</th>
                    <th className="p-4 text-center text-[#992787] dark:text-purple-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {currentPatients.map(patient => (

                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{patient.surname}</div>
                      </td>
                      <td className="p-4 max-md:hidden">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiOutlineMail className="w-4 h-4 text-[#992787] dark:text-purple-400" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiOutlinePhone className="w-4 h-4 text-[#992787] dark:text-purple-400" />
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
                            className="text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 p-2"
                          >
                            <HiOutlineDocumentAdd className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDetails(patient);
                              setShowDetails(true);
                            }}
                            className="text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 p-2"
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
          )}
        </div>


        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>


        {/* Add Patient Modal */}
        {showForm && (
          <div className="fixed inset-0 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 overflow-auto rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl">
              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787] dark:text-purple-400">
                  {formSteps[currentStep].title}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              {/* Progress indicators */}
              <div className="mb-4 flex justify-center gap-2">
                {formSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentStep
                      ? 'bg-[#992787] dark:bg-purple-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  />
                ))}
              </div>

              {/* Form steps */}
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formSteps[0].fields.map((field) => (
                    <div key={field.name} className="relative">
                      {field.icon && <field.icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />}
                      <input
                        type={field.type || 'text'}
                        placeholder={field.label}
                        value={newPatient[field.name]}
                        onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                        className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100`}
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
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option} className="dark:bg-gray-700">{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.label}
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={field.label}
                          value={newPatient[field.name]}
                          onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold mb-2 dark:text-gray-100">Consent Agreement</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      I hereby consent to participate in the screening process and authorize
                      the secure storage and sharing of my medical information with authorized
                      wellness professionals in compliance with POPIA regulations.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 w-full h-32 rounded-lg flex items-center justify-center">
                      {signature ? (
                        <img
                          src={signature}
                          alt="Signature"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500">Sign here</p>
                      )}
                    </div>
                    <button
                      onClick={handleSignatureClear}
                      className="mt-2 text-sm text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300"
                    >
                      Clear Signature
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {formSteps[3].fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-medium dark:text-gray-300">
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                            value={newPatient[field.name]}
                            onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || 'number'}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                            value={newPatient[field.name]}
                            onChange={(e) => setNewPatient({ ...newPatient, [field.name]: e.target.value })}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">BMI</label>
                    <div className={`p-3 rounded-lg text-center ${getBmiColor(calculateBMI(newPatient.height, newPatient.weight))}`}>
                      {calculateBMI(newPatient.height, newPatient.weight) !== null
                        ? calculateBMI(newPatient.height, newPatient.weight).toFixed(1)
                        : 'Enter height and weight to calculate BMI'}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-t pt-4 dark:border-gray-700">
                    <h3 className="font-semibold mb-4 dark:text-gray-100">Mental Health Assessment</h3>
                    {questions.map((q, index) => (
                      <div key={index} className="mb-4 space-y-2">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Enter health question"
                            value={q.question}
                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          />
                          <button
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions.splice(index, 1);
                              setQuestions(newQuestions);
                            }}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2"
                          >
                            <HiOutlineX className="w-5 h-5" />
                          </button>
                        </div>
                        <textarea
                          placeholder="Patient's response"
                          value={q.answer}
                          onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          rows={2}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setQuestions([...questions, { question: '', answer: '' }])}
                      className="flex items-center gap-2 text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 text-sm"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                      Add Custom Question
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  <HiOutlineArrowLeft className="inline mr-2" /> Back
                </button>
                <button
                  onClick={() => currentStep === formSteps.length - 1 ? handleAddPatient() : setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl relative max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787] dark:text-purple-400">
                  Patient Details - {selectedDetails.name}
                </h2>
                <button onClick={() => setShowDetails(false)}>
                  <HiOutlineX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto pr-4 -mr-4">
                <div className="grid grid-cols-2 gap-4 pb-4">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">Personal Information</h3>
                    <p className="dark:text-gray-300">ID: {selectedDetails.idNumber}</p>
                    <p className="dark:text-gray-300">Date of Birth: {new Date(selectedDetails.dateOfBirth).toLocaleDateString()}</p>
                    <p className="dark:text-gray-300">Email: {selectedDetails.email}</p>
                    <p className="dark:text-gray-300">Phone: {selectedDetails.cellPhone}</p>
                  </div>

                  {/* Medical Aid Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">Medical Aid Details</h3>
                    <p className="dark:text-gray-300">Scheme: {selectedDetails.schemeName || 'N/A'}</p>
                    <p className="dark:text-gray-300">Plan: {selectedDetails.planOption || 'N/A'}</p>
                    <p className="dark:text-gray-300">Member #: {selectedDetails.membershipNumber || 'N/A'}</p>
                    <p className="dark:text-gray-300">Main Member: {selectedDetails.mainMemberNames || 'N/A'}</p>
                    <p className="dark:text-gray-300">Address: {selectedDetails.mainMemberAddress || 'N/A'}</p>
                    <p className="dark:text-gray-300">Dependent Code: {selectedDetails.dependentCode || 'N/A'}</p>
                  </div>

                  {/* Medical Information */}
                  <div className="col-span-2 space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">Medical Information</h3>
                    <p className="dark:text-gray-300">
                      BMI: <span className={`${getBmiColor(selectedDetails.bmi)} px-2 py-1 rounded`}>
                        {selectedDetails.bmi}
                      </span>
                    </p>
                    {/* <p className="dark:text-gray-300">BMI: {selectedDetails.bmi}</p> */}
                    <p className="dark:text-gray-300">Cholesterol: {selectedDetails.cholesterol} mg/dL</p>
                    <p className="dark:text-gray-300">HIV Status: {selectedDetails.hiv}</p>
                    <p className="dark:text-gray-300">Glucose: {selectedDetails.glucose} mg/dL</p>
                  </div>

                  {/* Mental Health Assessment */}
                  <div className="col-span-2">
                    <h3 className="font-semibold mt-4 dark:text-gray-100">Mental Health Assessment</h3>
                    {selectedDetails.questions?.map((q, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium dark:text-gray-300">{q.question}</p>
                        <p className="text-gray-600 dark:text-gray-400">{q.answer || 'No response'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Signature */}
                  {selectedDetails.signature && (
                    <div className="col-span-2 mt-4">
                      <h3 className="font-semibold dark:text-gray-100">Consent Signature</h3>
                      <img
                        src={selectedDetails.signature}
                        alt="Consent signature"
                        className="w-48 h-32 border-2 border-gray-200 dark:border-gray-600 object-contain"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787] dark:text-purple-400">
                  New Referral for {selectedPatient.name}
                </h2>
                <button
                  onClick={() => setShowReferralForm(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Patient ID</p>
                      <p className="font-medium dark:text-gray-300">{selectedPatient.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium dark:text-gray-300">{selectedPatient.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Referral Comments
                  </label>
                  <textarea
                    placeholder="Enter detailed referral comments..."
                    value={referralComment}
                    onChange={(e) => setReferralComment(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/20 h-40 resize-none dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleAddReferral}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors"
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