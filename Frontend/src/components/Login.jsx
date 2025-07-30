import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(null); // null = no message, true = success, false = error
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        loginData
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);

        // ✅ STORE userId
        localStorage.setItem("userId", response.data.userId);

        // ✅ Store user role
        const userRole = response.data.role || "EMPLOYEE";
        localStorage.setItem("userRole", userRole.toUpperCase());

        // ✅ Redirect based on role
        if (userRole.toLowerCase() === "admin") {
          setMsg("Login successful! Redirecting to admin dashboard...");
          setSuccess(true);
          setTimeout(() => navigate("/admin/dashboard"), 1200);
        } else {
          setMsg("Login successful! Redirecting to employee dashboard...");
          setSuccess(true);
          setTimeout(() => navigate("/employee/dashboard"), 1200);
        }
      } else {
        setMsg(response.data.message || "Invalid credentials");
        setSuccess(false);
      }
      refreshData();
    } catch (err) {
      console.error("Login error:", err);
      setMsg("Invalid email or password");
      setSuccess(false);
    }
  };

  const refreshData = () => {
    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700 flex items-center justify-center gap-2 tracking-tight">
          <FaUserShield className="text-4xl" /> Login to FlexiSpot
        </h2>
        {msg && (
          <div
            className={`mb-4 text-center font-semibold rounded py-2 ${
              success
                ? "text-green-700 bg-green-50 border border-green-200"
                : "text-red-600 bg-red-50 border border-red-200"
            }`}
          >
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 bg-gray-50">
              <FiMail className="text-gray-400 mr-2 text-lg" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 bg-gray-50">
              <FiLock className="text-gray-400 mr-2 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-blue-500 mt-1 hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"} password
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </button>
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
