import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext.jsx";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [users, setUsers] = useState([]);
  const { loggedInUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/users`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Find a user with matching OTP
    const foundUser = users.find(user => user.eventCode === otp);
    
    if (foundUser) {
        loggedInUser(foundUser);
      navigate("/user-dashboard");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-full bg-transparent backdrop-blur-sm text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-400 mb-6">
          Enter The Login Verification Code VT-YYYYMMDD-####. Check your email for OTP.
        </p>
        <form onSubmit={handleSubmit}>
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
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
