import React, { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineTicket,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { UserContext } from "../../../context/authContext";
import Select from "react-select"; // You may need to install react-select

const generateEventCode = () => {
  const letters = "VT";
  const yearNow = new Date().getFullYear();
  const monthNow = String(new Date().getMonth() + 1).padStart(2, "0");
  const dayNow = String(new Date().getDate()).padStart(2, "0");
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${yearNow}${monthNow}${dayNow}-${randomNumbers}`;
};

const medicalProfessionalsOptions = [
  "Registered Nurses",
  "Podiatrist",
  "Physio",
  "Massage Therapist",
  "Psychology",
  "Other",
];

const EventBooking = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    eventCode: generateEventCode(),
    eventName: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    numberOfAttendees: "",
    additionalNotes: "",
    medicalProfessionalsNeeded: [], // <-- new field
  });

  const [errors, setErrors] = useState({});
  const [otherMedicalProfessional, setOtherMedicalProfessional] = useState("");

  const eventTypes = [
    "Body Mass Index (BMI) Assessment",
    "Random Blood Glucose Testing",
    "Blood Pressure Testing",
    "Total Cholesterol Testing",
    "HIV Counseling and Testing (HCT)",
    "Oral Health Education",
    "TB Screening questionnaire",
    "Lifestyle questionnaire",
    "Waste Disposal - Post Event",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for multi-select
  const handleProfessionalsChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData({
      ...formData,
      medicalProfessionalsNeeded: values,
    });
    // Reset otherProfessional if "Other" is deselected
    if (!values.includes("Other")) setOtherMedicalProfessional("");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "eventCode" && key !== "additionalNotes") {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (formData.clientPhone && !/^\d{10}$/.test(formData.clientPhone)) {
      formErrors.clientPhone = "Client phone must be 10 digits";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let professionals = formData.medicalProfessionalsNeeded;
      if (professionals.includes("Other") && otherMedicalProfessional.trim()) {
        professionals = professionals
          .filter((p) => p !== "Other")
          .concat(otherMedicalProfessional.trim());
      }
      const eventData = {
        eventCode: formData?.eventCode,
        clientName: user?.fullName,
        clientEmail: user?.email,
        clientPhone: user?.phone,
        eventName: formData.eventName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        numberOfAttendees: formData.numberOfAttendees,
        additionalNotes: formData.additionalNotes,
        status: null,
        role: "user",
        medicalProfessionalsNeeded: professionals,
      };

      try {
        const response = await axios.post(
          "https://wellness-backend-ntls.onrender.com/api/v1/events",
          eventData,
          { withCredentials: true }
        );
        console.log("User added:", response.data);
        toast.success("Event Inquiry Submitted Successfully!");

        // Generate new event code and reset form
        setFormData({
          eventCode: generateEventCode(), // Generate new code here
          eventName: "",
          eventType: "",
          eventDate: "",
          eventLocation: "",
          numberOfAttendees: "",
          additionalNotes: "",
          medicalProfessionalsNeeded: [], // Reset new field
        });
      } catch (error) {
        console.error("Error adding user:", error);
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
    <>
      <ToastContainer theme="colored" />
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-lg">
        <h2 className="text-3xl text-[#992787] dark:text-purple-400 font-bold text-center mb-8">
          Event Inquiry Form
        </h2>

        <div className="space-y-8">
          {/* Event Code Display */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-8 flex items-center">
            <HiOutlineTicket className="w-6 h-6 mr-2 text-[#992787] dark:text-purple-300" />
            <span className="text-[#992787] dark:text-purple-300 font-semibold">
              Your Event Code: {formData.eventCode}
            </span>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Name
              </label>
              <div className="relative">
                <HiOutlineTicket className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter event name"
                />
              </div>
              {errors.eventName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Type
              </label>
              <div className="relative">
                <HiOutlineTag className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.eventType && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.eventType}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Date
              </label>
              <div className="relative">
                <HiOutlineCalendar className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400" />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.eventDate && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.eventDate}
                </p>
              )}
            </div>

            {/* Event Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Location
              </label>
              <div className="relative">
                <HiOutlineMapPin className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter event location"
                />
              </div>
              {errors.eventLocation && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.eventLocation}
                </p>
              )}
            </div>

            {/* Number of Attendees */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Attendees
              </label>
              <div className="relative">
                <HiOutlineUserGroup className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  type="number"
                  name="numberOfAttendees"
                  value={formData.numberOfAttendees}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Estimated attendees"
                />
              </div>
              {errors.numberOfAttendees && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.numberOfAttendees}
                </p>
              )}
            </div>

            {/* Medical Professionals Needed */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical Professionals Needed
              </label>
              <div className="relative">
                <HiOutlineUserGroup className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400 pointer-events-none" />
                <div className="w-full">
                  <Select
                    isMulti
                    options={medicalProfessionalsOptions.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    classNamePrefix="select"
                    value={medicalProfessionalsOptions
                      .map((opt) => ({ value: opt, label: opt }))
                      .filter((opt) => formData.medicalProfessionalsNeeded.includes(opt.value))}
                    onChange={handleProfessionalsChange}
                    placeholder="Select professionals needed"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: '48px',
                        borderColor: state.isFocused ? '#992787' : '#e5e7eb',
                        boxShadow: state.isFocused ? '0 0 0 2px #e9d5ff' : undefined,
                        backgroundColor: state.isFocused ? '#fff' : undefined,
                        color: '#111827',
                        fontSize: '1rem',
                        borderRadius: '0.5rem',
                        paddingLeft: '2.75rem', // matches pl-12
                        paddingRight: '1rem',   // matches pr-4
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#6b7280',
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 50,
                      }),
                    }}
                  />
                </div>
              </div>
              {errors.medicalProfessionalsNeeded && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-4 h-4 mr-1" />
                  {errors.medicalProfessionalsNeeded}
                </p>
              )}

              {/* Other Medical Professional (if "Other" is selected) */}
              {formData.medicalProfessionalsNeeded.includes("Other") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Please specify
                  </label>
                  <div className="relative">
                    <HiOutlineUserGroup className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                    <input
                      type="text"
                      value={otherMedicalProfessional}
                      onChange={(e) => setOtherMedicalProfessional(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Specify other medical professional"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <div className="relative">
              <HiOutlineDocumentText className="w-6 h-6 absolute left-3 top-4 text-[#992787] dark:text-purple-400" />
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-32"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#992787] dark:bg-purple-600 hover:bg-[#7a1f6e] dark:hover:bg-purple-700 text-white py-4 px-8 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors"
          >
            <HiOutlineDocumentText className="w-5 h-5 mr-2" />
            Submit Inquiry
          </button>
        </div>
      </div>
    </>
  );
};

export default EventBooking;