import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const { loggedInUser, user } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate(); // For redirecting after login

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission (Register or Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      if (isRegister) {
        // Register User
        const response = await axios.post("http://localhost:5000/users", formData);
        setMessage("Registration successful! Please log in.");
        setIsRegister(false); // Switch to login form
      } else {
        // Login User
        const response = await axios.get("http://localhost:5000/users", {
          params: {
            clientEmail: formData.clientEmail,
            password: formData.password,
          },
        });

        if ((response?.data[0]?.clientEmail === formData.clientEmail) && (response?.data[0]?.password === formData.password)) {
          loggedInUser(response.data[0]);
          setMessage("Login successful!");
          navigate("/user-dashboard/apply-for-event"); // Redirect to user dashboard after login
        } else {
          setMessage("incorrect credentials");
        }

      }
    } catch (error) {
      setMessage("incorrect credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6" >
      <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {isRegister ? "Register an Account" : "Sign in to your account"}
        </h2>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#992787] p-2 text-white font-semibold hover:bg-[#6a1d82]"
          >
            {isRegister ? "Register" : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"} {" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#992787] hover:underline"
          >
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
