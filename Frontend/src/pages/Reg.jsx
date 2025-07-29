import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Reg = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "employee",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phoneNumber, password, confirmPassword } = formData;
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
      toast.error("Name should contain only letters.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Phone number should contain exactly 10 digits.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must contain letters and numbers (min 6 characters).");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const message = await registerUser(formData);
      toast.success(message || "Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Signup failed");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Signup Form
        </h2>

        {["name", "email", "phoneNumber", "department", "password", "confirmPassword"].map((field) => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-blue-700 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              id={field}
              name={field}
              type={field.toLowerCase().includes("password") ? "password" : "text"}
              value={formData[field]}
              onChange={handleChange}
              autoComplete={field}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-sm text-blue-700">
          Already have an account?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={handleLoginRedirect}
          >
            Log in here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Reg;
