import React, { useContext, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../context/authContext";


const generateEventCode = () => {
  const letters = "VT";
  const yearNow = new Date().getFullYear();
  const monthNow = String(new Date().getMonth() + 1).padStart(2, "0");
  const dayNow = String(new Date().getDate()).padStart(2, "0");
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  return `${letters}-${yearNow}${monthNow}${dayNow}-${randomNumbers}`;
};

const EventBooking = () => {
  const [formData, setFormData] = useState({
    eventCode: generateEventCode(),
    eventName: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    numberOfAttendees: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  const {user} = useContext(AuthContext);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form inputs
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

  // Handle form submission
  const handleSubmit = async (e) => {
   
    if (validateForm()) {
      const userData = {
        eventCode: formData.eventCode,
        clientName: user.clientName,
        clientEmail: user.clientEmail,
        clientPhone: user.clientPhone,
        eventName: formData.eventName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        numberOfAttendees: formData.numberOfAttendees,
        additionalNotes: formData.additionalNotes,
        status: null,
        role: "user",
      };

      try {
        // Send user data to JSON Server
        const response = await axios.post("https://wellness-temporary-db-2.onrender.com/events", userData);
        console.log("User added:", response.data);
        toast.success("Event Inquiry Submitted & User Added!");

        // Reset form (except eventCode)
        setFormData({
          ...formData,
          eventName: "",
          eventType: "",
          eventDate: "",
          eventLocation: "",
          numberOfAttendees: "",
          additionalNotes: "",
        });

      } catch (error) {
        console.error("Error adding user:", error);
        toast.error("Failed to add user.");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center" style={{ color: "rgb(153,39,135)" }}>
          Submit an Event Inquiry
        </h2>
        <>
          {Object.keys(formData).map((field) => (
            field !== "eventCode" && (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium" style={{ color: "rgb(153,39,135)" }}>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type={field.includes("Date") ? "date" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            )
          ))}
          <button
             onClick={(event) => { 
              event.preventDefault();  
              handleSubmit(event);
            }}
            className="w-[30%] py-3 text-white text-lg font-semibold rounded-md hover:opacity-90 transition duration-200"
            style={{ backgroundColor: "rgb(153,39,135)" }}
          >
            Submit Inquiry
          </button>
        </>
      </div>

    </>
  );
};

export default EventBooking;
