// Importing React and its hooks for component state and lifecycle management
import React, { useState, useEffect } from "react";
// Axios is used for making HTTP requests
import axios from "axios";
// useNavigate is a React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";
// Importing various icons from react-icons/hi (Heroicons) for UI enhancement
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineUserAdd,
  HiOutlineEye,
  HiOutlineSearch,
} from "react-icons/hi";
// Additional icons from Feather Icons (react-icons/fi)
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// Importing toast functionality for showing notifications
import { toast, ToastContainer } from "react-toastify";
// Importing required styles for react-toastify notifications
import "react-toastify/dist/ReactToastify.css";

import { useNurseEvent } from '../../../context/NurseEventContext';

const formSteps = [
  {
    title: "Patient Registration",
    fields: [
      { name: "fullName", label: "Full Name", icon: HiOutlineUser, required: true },
      { name: "surname", label: "Surname", icon: HiOutlineUser, required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "idNumber", label: "ID Number", required: true },
      { name: "email", label: "Email", type: "email", icon: HiOutlineMail, required: true },
      { name: "phone", label: "Cell Phone", type: "tel", icon: HiOutlinePhone, required: true },
      { name: "sex", label: "Sex", type: "select", options: ["Male", "Female", "Other"], required: true },
    ],
  },
  {
    title: "Medical Aid Details",
    fields: [
      { name: "schemeName", label: "Scheme Name" },
      { name: "planOption", label: "Plan/Option" },
      { name: "membershipNumber", label: "Membership Number" },
      { name: "mainMemberNames", label: "Main Member Names" },
      { name: "mainMemberAddress", label: "Main Member Address", type: "textarea" },
      { 
        name: "dependentCode", 
        label: "Dependent Code", 
        type: "select", 
        options: Array.from({ length: 10 }, (_, i) => i.toString().padStart(2, "0")) 
      },
    ],
  },
  {
    title: "Consent Agreement",
    fields: [
      { name: "consentSignature", label: "Digital Signature", type: "signature", required: true },
    ],
  },
  {
    title: "Medical Screening",
    fields: [
      { name: "height", label: "Height (cm)", type: "number" },
      { name: "weight", label: "Weight (kg)", type: "number" },
      { name: "cholesterol", label: "Total Cholesterol (mg/dL)", type: "number" },
      { name: "hivStatus", label: "HIV Screening Result", type: "select", options: ["Negative", "Positive", "Inconclusive"] },
      { name: "bloodPressure", label: "Blood Pressure (mmHg)", type: "text", required: true, placeholder: "e.g., 120/80 mmHg" },
      { name: "glucoseType", label: "Blood Glucose Type", type: "select", options: ["Fasting", "Random", "Postprandial"], required: true },
      { name: "hba1c", label: "HbA1c (%)", type: "number", step: "0.1", required: true },
      { name: "glucoseLevel", label: "Glucose Level (mmol/L)", type: "number", required: true },
    ],
  },
  {
    title: "Additional Health Questions",
    fields: [],
  },
];

const Backend = import.meta.env.VITE_BACKEND_URL;

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPatients, setCurrentPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newPatient, setNewPatient] = useState({
    personalInfo: {
      fullName: "",
      surname: "",
      dateOfBirth: "",
      idNumber: "",
      email: "",
      phone: "",
      sex: "",
    },
    medicalAidDetails: {
      schemeName: "",
      planOption: "",
      membershipNumber: "",
      mainMemberNames: "",
      mainMemberAddress: "",
      dependentCode: "",
    },
    medicalInfo: {
      height: "",
      weight: "",
      bloodPressure: "",
      cholesterol: "",
      hivStatus: "",
      glucoseType: "",
      hba1c: "",
      glucoseLevel: "",
    },
  });
  const [signature, setSignature] = useState("");
  const [questions, setQuestions] = useState([
    { question: "How often do you feel anxious?", answer: "" },
    { question: "Do you have trouble sleeping?", answer: "" },
  ]);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralComment, setReferralComment] = useState("");
  const [practitionerName, setPractitionerName] = useState("");
  const [practitionerEmail, setPractitionerEmail] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [referralLoading, setReferralLoading] = useState(false);
  const { eventData } = useNurseEvent();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(
          `${Backend}/api/v1/patients/event/${eventData?._id}`,
          { withCredentials: true }
        );
        setPatients(res.data.data);
        setFilteredPatients(res.data.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
      }
    };
    if (eventData?._id) fetchPatients();
  }, [eventData]);

  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = patient.personalInfo?.fullName?.toLowerCase() || '';
      const surname = patient.personalInfo?.surname?.toLowerCase() || '';
      const idNumber = patient.personalInfo?.idNumber?.toString() || '';
      const email = patient.personalInfo?.email?.toLowerCase() || '';

      return (
        fullName.includes(searchLower) ||
        surname.includes(searchLower) ||
        idNumber.includes(searchTerm) ||
        email.includes(searchLower)
      );
    });
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentPatients(
      filteredPatients.slice(indexOfFirstItem, indexOfLastItem)
    );
  }, [currentPage, filteredPatients, itemsPerPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const h = parseFloat(height) / 100; // Convert cm to meters
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
    return (w / (h * h)).toFixed(1);
  };

  const getBmiCategory = (bmi) => {
    if (!bmi) return "";
    const numBmi = parseFloat(bmi);
    if (numBmi < 18.5) return "Underweight";
    if (numBmi < 25) return "Normal weight";
    if (numBmi < 30) return "Overweight";
    return "Obese";
  };

  const getBmiColor = (bmi) => {
    if (bmi === undefined || bmi === null || bmi === "")
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    const numericBmi = typeof bmi === "string" ? parseFloat(bmi) : bmi;
    if (numericBmi < 17)
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    if (numericBmi < 18.5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    if (numericBmi < 25)
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    if (numericBmi < 30)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
  };

  const getGlucoseColor = (glucoseType, glucoseValue) => {
    const numericValue = parseFloat(glucoseValue);
    if (isNaN(numericValue))
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    switch (glucoseType) {
      case "Fasting":
        if (numericValue >= 7.0) return "bg-red-500 text-white";
        if (numericValue >= 5.6) return "bg-yellow-400 text-black";
        return "bg-green-500 text-white";
      case "Random":
      case "Postprandial":
        if (numericValue >= 11.1) return "bg-red-500 text-white";
        if (numericValue >= 7.8) return "bg-yellow-400 text-black";
        return "bg-green-500 text-white";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getBloodPressureColor = (value) => {
    if (!value)
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    const match = value.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match)
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";

    const systolic = parseInt(match[1], 10);
    const diastolic = parseInt(match[2], 10);

    if (isNaN(systolic) || isNaN(diastolic))
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";

    if (systolic < 120 && diastolic < 80) {
      return "bg-green-500 text-white";
    } else if (systolic < 139 && diastolic < 89) {
      return "bg-yellow-400 text-black";
    } else if (systolic >= 140 && diastolic >= 90) {
      return "bg-red-500 text-white";
    }
    return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  const getHbA1cColor = (value) => {
    if (!value) return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue))
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";

    if (numericValue < 5.7) return "bg-green-500 text-white";
    if (numericValue < 6.5) return "bg-yellow-400 text-black";
    return "bg-red-500 text-white";
  };

  const handleAddPatient = async () => {
    try {
      // Calculate BMI
      const bmi = calculateBMI(
        newPatient.medicalInfo.height, 
        newPatient.medicalInfo.weight
      );
      
      // Prepare patient data
      const patientData = {
        eventId: eventData?._id,
        personalInfo: newPatient.personalInfo,
        medicalInfo: {
          ...newPatient.medicalInfo,
          bmi: bmi ? parseFloat(bmi) : null
        },
        medicalAidDetails: newPatient.medicalAidDetails,
        mentalHealthAssessment: questions,
        consentSignature: signature
      };

      // Send request
      await axios.post(`${Backend}/api/v1/patients`, patientData, { 
        withCredentials: true 
      });
      
      toast.success("Patient registered successfully!");
      
      // Reset form
      setShowForm(false);
      setCurrentStep(0);
      setNewPatient({
        personalInfo: {
          fullName: "",
          surname: "",
          dateOfBirth: "",
          idNumber: "",
          email: "",
          phone: "",
          sex: "",
        },
        medicalAidDetails: {
          schemeName: "",
          planOption: "",
          membershipNumber: "",
          mainMemberNames: "",
          mainMemberAddress: "",
          dependentCode: "",
        },
        medicalInfo: {
          height: "",
          weight: "",
          bloodPressure: "",
          cholesterol: "",
          hivStatus: "",
          glucoseType: "",
          hba1c: "",
          glucoseLevel: "",
        },
      });
      setSignature("");
      setQuestions([
        { question: "How often do you feel anxious?", answer: "" },
        { question: "Do you have trouble sleeping?", answer: "" },
      ]);

      // Refresh patient list
      const res = await axios.get(
        `${Backend}/api/v1/patients/event/${eventData?._id}`,
        { withCredentials: true }
      );
      setPatients(res.data.data);
      setFilteredPatients(res.data.data);
      
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error(
        error.response?.data?.message || "Failed to register patient"
      );
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSignatureClear = () => {
    setSignature("");
  };

  const handleAddReferral = async () => {
    if (!practitionerName.trim() || !practitionerEmail.trim()) {
      toast.error("Please enter practitioner name and email");
      return;
    }
    if (!referralComment.trim()) {
      toast.error("Please enter referral comments");
      return;
    }
    if (!eventData?._id) {
      toast.error("No active event selected");
      return;
    }

    try {
      setReferralLoading(true);

      const referralData = {
        idNumber: selectedPatient.personalInfo.idNumber,
        eventId: eventData._id,
        practitionerName,
        practitionerEmail,
        comments: referralComment,
      };

      const response = await axios.post(
        `${Backend}/api/v1/refferals`,
        referralData,
        { withCredentials: true }
      );

      toast.success("Referral created successfully!");
      setShowReferralForm(false);
      setReferralComment("");
      setPractitionerName("");
      setPractitionerEmail("");
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error creating referral:", error);
      toast.error(
        error.response?.data?.message || "Failed to create referral"
      );
    } finally {
      setReferralLoading(false);
    }
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "";
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
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
                onClick={() => setSearchTerm("")}
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
                    <th className="p-4 text-left text-[#992787] dark:text-purple-400 font-semibold">
                      Patient Name
                    </th>
                    <th className="p-4 text-left text-[#992787] dark:text-purple-400 font-semibold max-md:hidden">
                      Contact Info
                    </th>
                    <th className="p-4 text-center text-[#992787] dark:text-purple-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {currentPatients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {patient?.personalInfo?.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {patient?.personalInfo?.surname}
                        </div>
                      </td>
                      <td className="p-4 max-md:hidden">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiOutlineMail className="w-4 h-4 text-[#992787] dark:text-purple-400" />
                            {patient?.personalInfo?.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiOutlinePhone className="w-4 h-4 text-[#992787] dark:text-purple-400" />
                            {patient?.personalInfo?.phone}
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
                            Referrals
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

              <div className="mb-4 flex justify-center gap-2">
                {formSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentStep
                        ? "bg-[#992787] dark:bg-purple-400"
                        : "bg-gray-300 dark:bg-gray-600"
                      }`}
                  />
                ))}
              </div>

              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formSteps[0].fields.map((field) => (
                    <div key={field.name} className="relative">
                      {field.type === "select" ? (
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                          value={newPatient.personalInfo[field.name] || ""}
                          onChange={(e) =>
                            setNewPatient({
                              ...newPatient,
                              personalInfo: {
                                ...newPatient.personalInfo,
                                [field.name]: e.target.value
                              }
                            })
                          }
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option
                              key={option}
                              value={option}
                              className="dark:bg-gray-700"
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          placeholder={field.label}
                          value={newPatient.personalInfo[field.name] || ""}
                          onChange={(e) =>
                            setNewPatient({
                              ...newPatient,
                              personalInfo: {
                                ...newPatient.personalInfo,
                                [field.name]: e.target.value
                              }
                            })
                          }
                          className={`w-full ${field.icon ? "pl-10" : "pl-4"
                            } pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100`}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {formSteps[1].fields.map((field) => (
                    <div key={field.name} className="relative">
                      {field.type === "select" ? (
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                          value={newPatient.medicalAidDetails[field.name] || ""}
                          onChange={(e) =>
                            setNewPatient({
                              ...newPatient,
                              medicalAidDetails: {
                                ...newPatient.medicalAidDetails,
                                [field.name]: e.target.value
                              }
                            })
                          }
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option
                              key={option}
                              value={option}
                              className="dark:bg-gray-700"
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          placeholder={field.label}
                          value={newPatient.medicalAidDetails[field.name] || ""}
                          onChange={(e) =>
                            setNewPatient({
                              ...newPatient,
                              medicalAidDetails: {
                                ...newPatient.medicalAidDetails,
                                [field.name]: e.target.value
                              }
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-transparent dark:text-gray-100"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={field.label}
                          value={newPatient.medicalAidDetails[field.name] || ""}
                          onChange={(e) =>
                            setNewPatient({
                              ...newPatient,
                              medicalAidDetails: {
                                ...newPatient.medicalAidDetails,
                                [field.name]: e.target.value
                              }
                            })
                          }
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
                    <h3 className="font-semibold mb-2 dark:text-gray-100">
                      Consent Agreement
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      I hereby consent to participate in the screening process
                      and authorize the secure storage and sharing of my medical
                      information with authorized wellness professionals in
                      compliance with POPIA regulations.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 w-full h-32 rounded-lg flex items-center justify-center">
                      {signature ? (
                        <img
                          src={signature}
                          alt="Signature"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500">
                          Sign here
                        </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formSteps[3].fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-[#992787]/20 focus:border-[#992787] dark:focus:border-purple-400"
                            value={newPatient.medicalInfo[field.name] || ""}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                medicalInfo: {
                                  ...newPatient.medicalInfo,
                                  [field.name]: e.target.value
                                }
                              })
                            }
                          >
                            <option value="">Select {field.label.split(' ')[0]}</option>
                            {field.options.map((option) => (
                              <option
                                key={option}
                                value={option}
                                className="dark:bg-gray-700"
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || "text"}
                            placeholder={field.placeholder || field.label}
                            value={newPatient.medicalInfo[field.name] || ""}
                            onChange={(e) =>
                              setNewPatient({
                                ...newPatient,
                                medicalInfo: {
                                  ...newPatient.medicalInfo,
                                  [field.name]: e.target.value
                                }
                              })
                            }
                            className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100"
                            step={field.step}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Body Mass Index (BMI)
                    </label>
                    <div
                      className={`p-4 rounded-lg text-center text-sm md:text-base ${getBmiColor(
                        calculateBMI(
                          newPatient.medicalInfo.height, 
                          newPatient.medicalInfo.weight
                        )
                      )}`}
                    >
                      {calculateBMI(
                        newPatient.medicalInfo.height, 
                        newPatient.medicalInfo.weight
                      ) || "Enter height and weight to calculate BMI"}
                      {calculateBMI(
                        newPatient.medicalInfo.height, 
                        newPatient.medicalInfo.weight
                      ) && (
                        <span className="block text-xs mt-1 opacity-80">
                          {getBmiCategory(
                            calculateBMI(
                              newPatient.medicalInfo.height, 
                              newPatient.medicalInfo.weight
                            )
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-t pt-4 dark:border-gray-700">
                    <h3 className="font-semibold mb-4 dark:text-gray-100">
                      Mental Health Assessment
                    </h3>
                    {questions.map((q, index) => (
                      <div key={index} className="mb-4 space-y-2">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Enter health question"
                            value={q.question}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "question",
                                e.target.value
                              )
                            }
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
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "answer",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                          rows={2}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setQuestions([
                          ...questions,
                          { question: "", answer: "" },
                        ])
                      }
                      className="flex items-center gap-2 text-[#992787] dark:text-purple-400 hover:text-[#7a1f6e] dark:hover:text-purple-300 text-sm"
                    >
                      <HiOutlinePlus className="w-5 h-5" />
                      Add Custom Question
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={() =>
                    setCurrentStep((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentStep === 0}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  <HiOutlineArrowLeft className="inline mr-2" /> Back
                </button>
                <button
                  onClick={() =>
                    currentStep === formSteps.length - 1
                      ? handleAddPatient()
                      : setCurrentStep((prev) => prev + 1)
                  }
                  className="px-6 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700"
                >
                  {currentStep === formSteps.length - 1 ? "Submit" : "Next"}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#992787] dark:text-purple-400">
                  Patient Details - {selectedDetails?.personalInfo?.fullName}
                </h2>
                <button onClick={() => setShowDetails(false)}>
                  <HiOutlineX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto pr-4 -mr-4">
                <div className="grid grid-cols-2 gap-4 pb-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">
                      Personal Information
                    </h3>
                    <p className="dark:text-gray-300">
                      ID: {selectedDetails?.personalInfo?.idNumber}
                    </p>
                    <p className="dark:text-gray-300">
                      Date of Birth:{" "}
                      {new Date(
                        selectedDetails?.personalInfo?.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                    <p className="dark:text-gray-300">
                      Age: {calculateAge(selectedDetails?.personalInfo?.dateOfBirth)}
                    </p>
                    <p className="dark:text-gray-300">
                      Email: {selectedDetails?.personalInfo?.email}
                    </p>
                    <p className="dark:text-gray-300">
                      Phone: {selectedDetails?.personalInfo?.phone}
                    </p>
                    <p className="dark:text-gray-300">
                      Sex: {selectedDetails?.personalInfo?.sex || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">
                      Medical Aid Details
                    </h3>
                    <p className="dark:text-gray-300">
                      Scheme: {selectedDetails?.medicalAidDetails?.schemeName || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Plan: {selectedDetails?.medicalAidDetails?.planOption || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Member #: {selectedDetails?.medicalAidDetails?.membershipNumber || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Main Member: {selectedDetails?.medicalAidDetails?.mainMemberNames || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Address: {selectedDetails?.medicalAidDetails?.mainMemberAddress || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Dependent Code: {selectedDetails?.medicalAidDetails?.dependentCode || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">
                      Medical Information
                    </h3>
                    <p className="dark:text-gray-300">
                      Blood Pressure:{" "}
                      <span
                        className={`${getBloodPressureColor(
                          selectedDetails?.medicalInfo?.bloodPressure
                        )} px-2 py-1 rounded`}
                      >
                        {selectedDetails?.medicalInfo?.bloodPressure || "N/A"}
                      </span>
                    </p>
                    <p className="dark:text-gray-300">
                      Height: {selectedDetails?.medicalInfo?.height ? `${selectedDetails?.medicalInfo?.height} cm` : "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Weight: {selectedDetails?.medicalInfo?.weight ? `${selectedDetails?.medicalInfo?.weight} kg` : "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      BMI:{" "}
                      <span
                        className={`${getBmiColor(
                          selectedDetails?.medicalInfo?.bmi
                        )} px-2 py-1 rounded`}
                      >
                        {selectedDetails?.medicalInfo?.bmi || "N/A"} 
                        {selectedDetails?.medicalInfo?.bmi && (
                          ` (${getBmiCategory(selectedDetails?.medicalInfo?.bmi)})`
                        )}
                      </span>
                    </p>
                    <p className="dark:text-gray-300">
                      Cholesterol: {selectedDetails?.medicalInfo?.cholesterol ? `${selectedDetails?.medicalInfo?.cholesterol} mg/dL` : "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      HIV Status: {selectedDetails?.medicalInfo?.hivStatus || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Glucose Type: {selectedDetails?.medicalInfo?.glucoseType || "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      Glucose Level:{" "}
                      {selectedDetails?.medicalInfo?.glucoseLevel ? (
                        <span
                          className={`${getGlucoseColor(
                            selectedDetails?.medicalInfo?.glucoseType,
                            selectedDetails?.medicalInfo?.glucoseLevel
                          )} px-2 py-1 rounded`}
                        >
                          {selectedDetails?.medicalInfo?.glucoseLevel} mmol/L
                        </span>
                      ) : "N/A"}
                    </p>
                    <p className="dark:text-gray-300">
                      HbA1c:{" "}
                      {selectedDetails?.medicalInfo?.hba1c ? (
                        <span
                          className={`${getHbA1cColor(
                            selectedDetails?.medicalInfo?.hba1c
                          )} px-2 py-1 rounded`}
                        >
                          {selectedDetails?.medicalInfo?.hba1c}%
                        </span>
                      ) : "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <h3 className="font-semibold mt-4 dark:text-gray-100">
                      Mental Health Assessment
                    </h3>
                    {selectedDetails?.mentalHealthAssessment?.map((q, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium dark:text-gray-300">
                          {q.question}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {q.answer || "No response"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {selectedDetails?.consentSignature && (
                    <div className="col-span-2 mt-4">
                      <h3 className="font-semibold dark:text-gray-100">
                        Consent Signature
                      </h3>
                      <img
                        src={selectedDetails.consentSignature}
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
                  New Referral for {selectedPatient?.personalInfo?.fullName}
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
                      <p className="text-gray-500 dark:text-gray-400">
                        Patient ID
                      </p>
                      <p className="font-medium dark:text-gray-300">
                        {selectedPatient?.personalInfo.idNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium dark:text-gray-300">
                        {selectedPatient?.personalInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Health Practitioner's Name
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. John Smith"
                      value={practitionerName}
                      onChange={(e) => setPractitionerName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/20 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Health Practitioner's Email
                    </label>
                    <input
                      type="email"
                      placeholder="practitioner@clinic.com"
                      value={practitionerEmail}
                      onChange={(e) => setPractitionerEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/20 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Referral Comments
                    </label>
                    <textarea
                      placeholder="Enter detailed referral comments..."
                      value={referralComment}
                      onChange={(e) => setReferralComment(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#992787]/20 dark:focus:ring-purple-400/20 h-32 resize-none dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleAddReferral}
                  disabled={referralLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 ${
                    referralLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-[#992787] dark:bg-purple-600 hover:bg-[#7a1f6e] dark:hover:bg-purple-700"
                  } text-white rounded-lg transition-colors`}
                >
                  {referralLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      Submit Referral
                      <HiOutlineArrowRight className="w-5 h-5" />
                    </>
                  )}
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