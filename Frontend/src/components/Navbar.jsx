import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">
        <Link to="/">FlexiSpot</Link>
      </div>
      <div className="space-x-6 text-lg">
        <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
        <Link to="/booking" className="hover:text-yellow-400 transition">Book Now</Link>
        <Link to="/show-booking" className="hover:text-yellow-400 transition">Show Booking</Link> 
        <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
