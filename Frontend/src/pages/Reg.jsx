import React, { useState } from 'react';

const Reg = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register:', formData);
    // Add API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring"
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring"
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-medium">Phone Number</label>
        <input
          type="text"
          name="phone"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring"
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          name="password"
          className="w-full px-3 py-2 border rounded mb-6 focus:outline-none focus:ring"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Reg;
