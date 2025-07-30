
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import UsageAnalytics from './components/UsageAnalytics';
import EmployeeLayout from './components/EmployeeLayout';
import EmployeeDashboard from './components/EmployeeDashboard';
import BookNow from './pages/BookNow';
import ShowBooking from './pages/ShowBooking';

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Show Navbar on all pages */}
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="book-now" element={<BookNow />} />
            <Route path="show-booking" element={<ShowBooking />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="usage-analytics" element={<UsageAnalytics />} />
          </Route>
        </Routes>
      </main>

      {/* Show Footer on all pages */}
      <Footer />
    </div>
  );
}

export default App;
