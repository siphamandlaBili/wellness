import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';

const generateEventCode = () => {
  // VT-YYYYMMDD-####
  const letters = "VT";
  const yearNow = new Date().getFullYear();
  const monthNow = String(new Date().getMonth() + 1).padStart(2, "0");
  const dayNow = String(new Date().getDate()).padStart(2, "0");
  const firstNumber = Math.floor(Math.random() * 9);
  const secondNumber = Math.floor(Math.random() * 9);
  const thirdNumber = Math.floor(Math.random() * 9);
  const fourthNumber = Math.floor(Math.random() * 9);

  const eventCode = `${letters}-${yearNow}${monthNow}${dayNow}-${firstNumber}${secondNumber}${thirdNumber}${fourthNumber}`;
  return eventCode;
};

const EventBooking = () => {
  const [formData, setFormData] = useState({
    eventCode: generateEventCode(),
    eventName: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    numberOfAttendees: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    additionalNotes: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "eventCode") {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (formData.clientPhone && !/\d{10}/.test(formData.clientPhone)) {
      formErrors.clientPhone = "Client phone must be 10 digits";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        toast.success("Event Inquiry Submitted");
      console.log("Event Inquiry Submitted:", formData);
    } else{
        toast.error("Submit all required fileds");
    }
  };

  return (
    <>
    <ToastContainer />
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center" style={{ color: "rgb(153,39,135)" }}>
          Submit an Event Inquiry
        </h2>
        <form onSubmit={handleSubmit}>

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
            type="submit"
            className="w-[30%] py-3 text-white text-lg font-semibold rounded-md hover:opacity-90 transition duration-200"
            style={{ backgroundColor: "rgb(153,39,135)" }}
          >
            Submit Inquiry
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EventBooking;
