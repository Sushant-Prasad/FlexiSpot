import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiLogOut, FiCalendar, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", path: "/employee/dashboard", icon: null },
  { label: "Book Now", path: "/employee/book-now", icon: FiCalendar },
  { label: "Show Booking", path: "/employee/show-booking", icon: FiList },
];

function EmployeeLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 h-[calc(100vh-70px)] bg-blue-700 text-white flex flex-col py-8 px-4 justify-between sticky top-[64px]">
        <div>
          <h2 className="text-2xl font-bold mb-2">Employee Panel</h2>
          <nav className="flex flex-col gap-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-3 ${
                    location.pathname === item.path
                      ? "bg-blue-900"
                      : "hover:bg-blue-800"
                  }`}
                >
                  {Icon && <Icon className="text-lg" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-blue-800 hover:bg-blue-900 transition-colors mt-8 w-full justify-center"
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>
      </aside>

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50 h-[calc(100vh-112px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
