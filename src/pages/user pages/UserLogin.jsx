import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const allUsers = await axios.get("https://wellness-temporary-db-2.onrender.com/users");
        const isEmailExist = allUsers.data.some(user => user.clientEmail === formData.clientEmail);
        if (isEmailExist) {
          toast.error("Email already exists.");
          return;
        }

        await axios.post("https://wellness-temporary-db-2.onrender.com/users", formData);
        toast.success("Registration successful!");
        setIsRegister(false);
      } else {
        const response = await axios.get("https://wellness-temporary-db-2.onrender.com/users", {
          params: { clientEmail: formData.clientEmail, password: formData.password },
        });
        const foundUser = response?.data[0];

        if (foundUser) {
          loggedInUser(foundUser);
          toast.success("Login successful!");

          let route = foundUser.role === "nurse" ? "/nurse/events"
            : foundUser.role === "superadmin" ? "/superadmin"
              : foundUser.role === "admin" ? "/admin/view-applications"
                : "/user-dashboard/apply-for-event";

          setTimeout(() => navigate(route), 1000); // Delay for toast to show
        } else {
          toast.error("Incorrect credentials.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans dark:bg-gray-900">
    <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
  
    {/* Static Image Section */}
    <div className="hidden md:block w-1/2 relative">
      <img
        src="https://www.parihomehealthcare.in/wp-content/uploads/2023/05/medium-shot-middle-aged-doctor-explaining-diagnosis-via-tablet-pc.jpg"
        alt="Auth background"
        className="w-full h-full object-cover rounded-l-xl"
      />
    </div>
  
    {/* Signup / Login Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-6 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {isRegister ? "Get Started Now" : "Welcome back!"}
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {isRegister
            ? "Create your credentials to access your account"
            : "Enter your credentials to access your account"}
        </p>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <input
                type="text"
                name="clientName"
                placeholder="Full Name"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="clientEmail"
              placeholder="Email Address"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          {isRegister && (
            <div>
              <input
                type="text"
                name="clientPhone"
                placeholder="Phone Number"
                value={formData.clientPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
          )}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#992787] hover:bg-[#892277] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-200 text-white py-2 rounded-md font-medium text-sm"
          >
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>
  
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#992787] dark:text-purple-400 hover:underline font-medium"
          >
            {isRegister ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
