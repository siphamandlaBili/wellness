import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../context/authContext";

const Backend= import.meta.env.VITE_BACKEND_URL;

export default function AuthForm() {
  const { login, user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        const payload = {
          fullName: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          password: formData.password,
          role: "user",
        };

        const response = await axios.post(
          `${Backend}/api/v1/register`,
          payload,
          { withCredentials: true }
        );

        if (response?.data?.success) {
          toast.success(response?.data?.message);
          setIsRegister(false);
        }
      } else {
        const payload = {
          email: formData.clientEmail,
          password: formData.password,
        };
        
        const response = await axios.post(
          `${Backend}/api/v1/login`,
          payload,
          { withCredentials: true }
        );

        if (response?.data?.success) {
          await login(response?.data.user);
          
          const userRole = response.data.user.role;
          const route = userRole === "nurse" ? "/nurse/events"
            : userRole === "superadmin" ? "/superadmin"
            : userRole === "admin" ? "/admin/view-applications"
            : "/user-dashboard/apply-for-event";

          setTimeout(() => navigate(route), 1000);
        } else{
            toast.error(response.data.message);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Left Side Image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://th.bing.com/th/id/OIP.OpA3AOEKV2e1-3OMEPOoYgHaEc?rs=1&pid=ImgDetMain"
          alt="Auth background"
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>

      {/* Right Side Form */}
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="clientName"
                  placeholder="Full Name"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="clientEmail"
                placeholder="Email Address"
                value={formData.clientEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

            {isRegister && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="clientPhone"
                  placeholder="Phone Number"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 transition-colors dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#992787] hover:bg-[#892277] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all duration-200 text-white py-2 rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : isRegister ? (
                "Sign Up"
              ) : (
                "Login"
              )}
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