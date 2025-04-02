import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role is admin
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example validation (you can replace this with actual API call)
    if (email === "" || password === "") {
      setError("Please enter both email and password");
      return;
    }

    // Dummy logic to simulate role-based redirection
    if (role === "admin" && email === "admin@example.com" && password === "admin123") {
      // Redirect to Admin Dashboard
      navigate("/admin");
    } else if (role === "super-admin" && email === "superadmin@example.com" && password === "superadmin123") {
      // Redirect to Super Admin Dashboard
      navigate("/super-admin");
    } else {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700">Login as</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="mr-2"
                />
                Admin
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="super-admin"
                  checked={role === "super-admin"}
                  onChange={() => setRole("super-admin")}
                  className="mr-2"
                />
                Super Admin
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[rgb(153,39,135)] hover:bg-[rgb(130,30,115)] text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
