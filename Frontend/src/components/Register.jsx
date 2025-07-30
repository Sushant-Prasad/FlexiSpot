
import React, { useState, useRef } from 'react';
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const msgTimeout = useRef(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    fullName: ""
  });

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1005/register/add", register);
      if (response.data.success) {
        //alert("Registration successful! You can now login.");
        setMsg("Registration successful! You can now login.");
        setShowMsg(true);
        setSuccess(true);
        setRegister({ username: "", email: "", password: "", role: "", fullName: "" });
        return;
      }
    } catch (err) {
      setMsg("Registration failed. Try again.");
      setShowMsg(true);
      if (msgTimeout.current) clearTimeout(msgTimeout.current);
      msgTimeout.current = setTimeout(() => {
        setShowMsg(false);
        setMsg("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700 flex items-center justify-center gap-2 tracking-tight">
          <FiUser className="text-4xl" /> Create an Account
        </h2>
        {showMsg && msg && (
          <div className="mb-4">
            <p className={`text-center font-semibold rounded py-2 ${success ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>{msg}</p>
            {success && (
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            )}
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={register.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none bg-gray-50 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={register.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none bg-gray-50 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={register.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none bg-gray-50 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
              <select
                name="role"
                value={register.role}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none bg-gray-50 focus:border-blue-500 text-gray-900"
              >
                <option value="">Select your role</option>
                <option value="employee">Employee - Book desks and meeting rooms</option>
                <option value="admin">Admin - Manage system and view analytics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 bg-gray-50">
                <FiLock className="text-gray-400 mr-2 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={register.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400"
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
              Register
            </button>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
