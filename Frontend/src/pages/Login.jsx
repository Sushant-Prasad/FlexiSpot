import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (formData.password.trim().length === 0) {
      toast.error("Password cannot be empty.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await loginUser(formData); // API call + stores token
      toast.success("Login successful!");
      navigate("/booking"); // redirect to bookings page
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-blue-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-blue-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Log In
        </button>

        <p className="mt-6 text-center text-sm text-blue-700">
          New user?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={handleSignupRedirect}
          >
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
