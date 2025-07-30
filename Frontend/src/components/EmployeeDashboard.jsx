import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiLoader,
  FiBriefcase 
} from "react-icons/fi";
import { FaChair } from "react-icons/fa";


import { getAllBookings } from "../services/bookingServices";
import { getAllMeetingBookings } from "../services/meetinRoomBookingServices";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const seatData = await getAllBookings();
        const meetingData = await getAllMeetingBookings();
        const all = [
          ...seatData.filter((b) => b.userId === userId).map((b) => ({ ...b, type: "Seat" })),
          ...meetingData.filter((b) => b.userId === userId).map((b) => ({ ...b, type: "Meeting Room" }))
        ];
        setBookings(all);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, navigate]);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => b.status === "ACTIVE");
  const seatBookings = activeBookings.filter((b) => b.type === "Seat");
  const meetingBookings = activeBookings.filter((b) => b.type === "Meeting Room");

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: FiCalendar, color: "bg-blue-500" },
    { label: "Active Bookings", value: activeBookings.length, icon: FiClock, color: "bg-green-500" },
    { label: "Seat Bookings", value: seatBookings.length, icon:  FaChair, color: "bg-purple-500" },
    { label: "Meeting Room Bookings", value: meetingBookings.length, icon: FiBriefcase, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Manage your workspace bookings and view your schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <FiLoader className="mx-auto animate-spin text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div key={`${booking.type}-${booking.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${booking.type === 'Seat' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {booking.type === 'Seat' ? (
                        <FiUser className="text-blue-600" />
                      ) : (
                        <FiCalendar className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.type} - {booking.seatCode || booking.meetingRoomCode}
                      </h3>
                      <p className="text-sm text-gray-600">{booking.location || booking.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {dayjs(booking.date).format("DD MMM YYYY")}
                    </p>
                    <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
