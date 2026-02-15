import React from 'react';
import { FaCalendarAlt, FaUsers, FaChartBar, FaClock } from 'react-icons/fa';
import { MdEventSeat, MdMeetingRoom } from 'react-icons/md';

const features = [
  {
    title: 'Smart Seat Booking',
    description: 'Book flexible work seats in 30-minute slots with real-time availability tracking.',
    icon: <MdEventSeat className="text-blue-600" size={40} />
  },
  {
    title: 'Meeting Room Reservation',
    description: 'Reserve meeting rooms in 1-hour time slots with instant conflict detection.',
    icon: <MdMeetingRoom className="text-blue-600" size={40} />
  },
  {
    title: 'Time-Based Cancellation Rules',
    description: 'Built-in smart policies prevent last-minute cancellations for better resource planning.',
    icon: <FaClock className="text-blue-600" size={40} />
  },
  {
    title: 'Real-Time Availability',
    description: 'Live seat and room availability updates based on active bookings only.',
    icon: <FaCalendarAlt className="text-blue-600" size={40} />
  },
  {
    title: 'Employee Dashboard',
    description: 'View booking history, active reservations, and upcoming schedules in one place.',
    icon: <FaUsers className="text-blue-600" size={40} />
  },
  {
    title: 'Analytics & Insights',
    description: 'Track workspace usage trends, occupancy rates, and resource utilization.',
    icon: <FaChartBar className="text-blue-600" size={40} />
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          FlexiSpot Smart Workspace Features
        </h2>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
