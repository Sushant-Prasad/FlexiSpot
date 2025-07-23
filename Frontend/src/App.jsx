import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookNow from './pages/BookNow';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Reg from './pages/Reg';
import ErrorPage from './pages/ErrorPage'; 
import ShowBooking from './pages/ShowBooking'; 

function App() {
  return (
     <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookNow />} />
        <Route path="/show-booking" element={<ShowBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Reg />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
