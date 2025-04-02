import { nav } from "framer-motion/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    let value = e.target.value.toUpperCase();
      setOtp(value);
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-full bg-transparent backdrop-blur-sm text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-400 mb-6">Enter The Login Verication Code VT-YYYYMMDD-#### .check your emails for OTP</p>
        <div className="mb-6">
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            placeholder="VT-YYYYMMDD-####"
            className="w-full h-12 text-center text-xl font-bold border-2 border-purple-500 bg-gray-700 rounded-lg focus:outline-none focus:border-purple-400"
          />
        </div>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          onClick={() => navigate("/user-dashboard")}
        >
          Verify
        </button>

      </div>
    </div>
  );
}
