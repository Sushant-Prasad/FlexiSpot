// import React, { useState, useRef } from 'react';
// import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import { registerUser } from '../services/authServices';
// function Reg() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [showMsg, setShowMsg] = useState(false);
//   const msgTimeout = useRef(null);
//   const navigate = useNavigate();
//   const [success, setSuccess] = useState(false);

//   const [register, setRegister] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     role: "",
//     department: "",
//     password: "",
//     confirmPassword: ""
//   });

//   const handleChange = (e) => {
//     setRegister({ ...register, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (register.password !== register.confirmPassword) {
//       setMsg("Passwords do not match");
//       setShowMsg(true);
//       setSuccess(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:1005/auth/register", register);
//       if (response.data.success) {
//         setMsg("Registration successful! You can now login.");
//         setShowMsg(true);
//         setSuccess(true);
//         setRegister({
//           name: "", email: "", phoneNumber: "", empId: "", role: "",
//           department: "", password: "", confirmPassword: ""
//         });
//         return;
//       }
//     } catch (err) {
//       setMsg("Registration failed. Try again.");
//       setShowMsg(true);
//       if (msgTimeout.current) clearTimeout(msgTimeout.current);
//       msgTimeout.current = setTimeout(() => {
//         setShowMsg(false);
//         setMsg("");
//       }, 5000);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-blue-100">
//         <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-700 flex items-center justify-center gap-2 tracking-tight">
//           <FiUser className="text-4xl" /> Create an Account
//         </h2>

//         {showMsg && msg && (
//           <div className="mb-4">
//             <p className={`text-center font-semibold rounded py-2 ${success ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>{msg}</p>
//             {success && (
//               <button
//                 className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
//                 onClick={() => navigate('/login')}
//               >
//                 Go to Login
//               </button>
//             )}
//           </div>
//         )}

//         {!success && (
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={register.name}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             {/* Email */}
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={register.email}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             {/* Phone Number */}
//             <input
//               type="text"
//               name="phoneNumber"
//               placeholder="Phone Number"
//               value={register.phoneNumber}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             {/* Department */}
//             <input
//               type="text"
//               name="department"
//               placeholder="Department"
//               value={register.department}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             {/* Role */}
//             <select
//               name="role"
//               value={register.role}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             >
//               <option value="">Select Role</option>
//               <option value="Employee">Employee</option>
//               <option value="Admin">Admin</option>
//             </select>

//             {/* Password */}
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={register.password}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             {/* Confirm Password */}
//             <input
//               type={showPassword ? "text" : "password"}
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={register.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-lg bg-gray-50"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="text-xs text-blue-500 hover:underline"
//             >
//               {showPassword ? "Hide Password" : "Show Password"}
//             </button>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
//             >
//               Register
//             </button>

//             <p className="text-center text-sm text-gray-600 mt-2">
//               Already have an account?{" "}
//               <a href="/login" className="text-blue-600 hover:underline font-medium">Login</a>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Reg;
