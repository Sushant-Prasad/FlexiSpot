
import React from 'react';
import { FaCalendarAlt, FaChalkboardTeacher, FaBook, FaChartBar } from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';

const features = [
  {
    title: 'Schedule Management',
    description: 'Efficiently organize and manage teacher schedules with ease.',
    icon: <FaCalendarAlt className="text-blue-600" size={40} />
  },
  {
    title: 'Desk Reservation',
    description: 'Book desks in advance and avoid workplace hassle.',
    icon: <MdEventSeat className="text-blue-600" size={40} />
  },
  {
    title: 'Virtual Training',
    description: 'Conduct and manage training sessions from anywhere.',
    icon: <FaChalkboardTeacher className="text-blue-600" size={40} />
  },
  {
    title: 'Resource Library',
    description: 'Access a centralized hub of workplace resources.',
    icon: <FaBook className="text-blue-600" size={40} />
  },
  {
    title: 'Analytics Dashboard',
    description: 'Gain insights with real-time analytics and usage data.',
    icon: <FaChartBar className="text-blue-600" size={40} />
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Powerful Features at Your Fingertips
        </h2>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-md transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
