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
import Select from "react-select";

const Backend = import.meta.env.VITE_BACKEND_URL;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    eventCode: generateEventCode(),
    eventName: "",
    eventType: "",
    eventDate: "",
    venue: "",
    numberOfAttendees: "",
    additionalNotes: "",
    medicalProfessionalsNeeded: [],
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

  const handleProfessionalsChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData({
      ...formData,
      medicalProfessionalsNeeded: values,
    });
    if (!values.includes("Other")) setOtherMedicalProfessional("");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      "eventName",
      "eventType",
      "eventDate",
      "venue",
      "numberOfAttendees"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        formErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // Phone validation
    if (user?.phone && !/^\d{10}$/.test(user.phone)) {
      formErrors.clientPhone = "Client phone must be 10 digits";
      isValid = false;
    }

    // Medical professionals validation
    if (formData.medicalProfessionalsNeeded.length === 0) {
      formErrors.medicalProfessionalsNeeded = "At least one professional type is required";
      isValid = false;
    }

    // Other professional validation
    if (
      formData.medicalProfessionalsNeeded.includes("Other") && 
      !otherMedicalProfessional.trim()
    ) {
      formErrors.otherMedicalProfessional = "Please specify the professional type";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        // Prepare professionals array
        let professionals = [...formData.medicalProfessionalsNeeded];
        
        // Handle "Other" professional type
        if (professionals.includes("Other") && otherMedicalProfessional.trim()) {
          professionals = professionals
            .filter(p => p !== "Other")
            .concat(otherMedicalProfessional.trim());
        }

        // Prepare event data in EXACT structure backend expects
        const eventData = {
          eventCode: formData.eventCode,
          clientName: user?.fullName || "",
          clientEmail: user?.email || "",
          clientPhone: user?.phone || "",
          eventName: formData.eventName,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          venue: formData.venue,
          numberOfAttendees: parseInt(formData.numberOfAttendees, 10),
          additionalNotes: formData.additionalNotes,
          medicalProfessionalsNeeded: professionals,
          status: "Pending",
          role: "user"
        };

        const response = await axios.post(
          `${Backend}/api/v1/events`,
          eventData,
          { withCredentials: true }
        );
        
        toast.success("Event Inquiry Submitted Successfully!");

        // Reset form with new event code
        setFormData({
          eventCode: generateEventCode(),
          eventName: "",
          eventType: "",
          eventDate: "",
          venue: "",
          numberOfAttendees: "",
          additionalNotes: "",
          medicalProfessionalsNeeded: [],
        });
        setOtherMedicalProfessional("");
        setErrors({});
        
      } catch (error) {
        console.error("Error adding event:", error);
        toast.error(
          error.response?.data?.message || 
          "Failed to submit inquiry. Please try again."
        );
      }
    } else {
      toast.error("Please fill in all required fields");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-[#992787] dark:text-purple-400 font-bold mb-6">
          Event Inquiry Form
        </h2>

        <div className="space-y-6">
          {/* Event Code Display */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6 flex items-center">
            <HiOutlineTicket className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#992787] dark:text-purple-300" />
            <span className="text-sm sm:text-base text-[#992787] dark:text-purple-300 font-semibold">
              Your Event Code: {formData.eventCode}
            </span>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Event Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineTicket className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter event name"
                />
              </div>
              {errors.eventName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.eventName}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineTag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.eventType}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineCalendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400" />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.eventDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.eventDate}
                </p>
              )}
            </div>

            {/* Event Venue */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Venue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineMapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter event venue"
                />
              </div>
              {errors.venue && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.venue}
                </p>
              )}
            </div>

            {/* Number of Attendees */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attendees <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUserGroup className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                <input
                  type="number"
                  name="numberOfAttendees"
                  value={formData.numberOfAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Estimated attendees"
                />
              </div>
              {errors.numberOfAttendees && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.numberOfAttendees}
                </p>
              )}
            </div>

            {/* Medical Professionals Needed */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professionals Needed <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineUserGroup className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400 pointer-events-none" />
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
                    placeholder="Select professionals"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '42px',
                        borderColor: errors.medicalProfessionalsNeeded 
                          ? '#ef4444' 
                          : '#e5e7eb',
                        boxShadow: errors.medicalProfessionalsNeeded 
                          ? '0 0 0 1px #ef4444' 
                          : undefined,
                        '&:hover': {
                          borderColor: errors.medicalProfessionalsNeeded 
                            ? '#ef4444' 
                            : '#d1d5db',
                        },
                        paddingLeft: '2.5rem',
                        backgroundColor: '#fff',
                        color: '#111827',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#f3e8ff',
                        color: '#7c3aed',
                        fontSize: '0.875rem',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: '#6b7280',
                        fontSize: '0.875rem',
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
                <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                  <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                  {errors.medicalProfessionalsNeeded}
                </p>
              )}

              {/* Other Medical Professional */}
              {formData.medicalProfessionalsNeeded.includes("Other") && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specify Professional
                  </label>
                  <div className="relative">
                    <HiOutlineUserGroup className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#992787] dark:text-purple-400" />
                    <input
                      type="text"
                      value={otherMedicalProfessional}
                      onChange={(e) => setOtherMedicalProfessional(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 ${
                        errors.otherMedicalProfessional 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-600'
                      } focus:border-[#992787] dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                      placeholder="Specify professional"
                    />
                  </div>
                  {errors.otherMedicalProfessional && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                      <HiOutlineExclamationCircle className="w-3 h-3 mr-1" />
                      {errors.otherMedicalProfessional}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <div className="relative">
              <HiOutlineDocumentText className="w-5 h-5 absolute left-3 top-3 text-[#992787] dark:text-purple-400" />
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-200/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-28"
                placeholder="Special requirements or notes..."
              />
            </div>
          </div>

          {/* Client Info Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Client Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="ml-2 dark:text-gray-200">{user?.fullName || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="ml-2 dark:text-gray-200">{user?.email || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="ml-2 dark:text-gray-200">{user?.phone || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Event Code:</span>
                <span className="ml-2 dark:text-gray-200 font-medium">{formData.eventCode}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-[#992787] dark:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-base flex items-center justify-center transition-colors ${
              isSubmitting 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-[#7a1f6e] dark:hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <HiOutlineDocumentText className="w-5 h-5 mr-2" />
                Submit Inquiry
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventBooking;