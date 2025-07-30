
import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaUser, FaCog } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated (you can modify this based on your auth logic)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  const isEmployeePage = location.pathname.startsWith('/employee');
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 font-cursive">
        FlexiSpot
      </Link>

      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignInAlt />
              Login
            </Link>
          </>
        ) : (
          <>
            {userRole === 'ADMIN' && !isAdminPage && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
              >
                <FaCog />
                Admin Panel
              </Link>
            )}

            {userRole === 'EMPLOYEE' && !isEmployeePage && (
              <Link
                to="/employee/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
              >
                <FaUser />
                Employee Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg transition-colors"
            >
              <FaSignInAlt />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

