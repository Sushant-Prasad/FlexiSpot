import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";

function EmployeeDashboard() {
    // Mock data for demonstration
    const upcomingBookings = [
        {
            id: 1,
            type: "Seat",
            location: "Delhi - Building A",
            date: "2024-01-15",
            time: "09:00 - 17:00",
            seatCode: "A1-101"
        },
        {
            id: 2,
            type: "Meeting Room",
            location: "Delhi - Building B",
            date: "2024-01-16",
            time: "14:00 - 16:00",
            roomCode: "B2-205"
        }
    ];

    const stats = [
        { label: "Total Bookings", value: "12", icon: FiCalendar, color: "bg-blue-500" },
        { label: "Active Bookings", value: "3", icon: FiClock, color: "bg-green-500" },
        { label: "Locations Used", value: "4", icon: FiMapPin, color: "bg-purple-500" },
        { label: "This Month", value: "8", icon: FiUser, color: "bg-orange-500" }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
                <p className="text-gray-600">Manage your workspace bookings and view your schedule.</p>
            </div>

            {/* Stats Cards */}
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

            {/* Upcoming Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
                </div>
                <div className="p-6">
                    {upcomingBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <FiCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-500">No upcoming bookings</p>
                            <p className="text-sm text-gray-400">Book a seat or meeting room to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                                                {booking.type} - {booking.seatCode || booking.roomCode}
                                            </h3>
                                            <p className="text-sm text-gray-600">{booking.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                                        <p className="text-sm text-gray-600">{booking.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FiCalendar className="mr-2" />
                        Book a Seat
                    </button>
                    <button className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <FiCalendar className="mr-2" />
                        Book Meeting Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard; 