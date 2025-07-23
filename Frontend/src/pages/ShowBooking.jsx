import { useEffect, useState } from 'react';
import { getAllBookings, cancelBooking } from '../services/bookingServices';

const ShowBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        console.log('Bookings:', data); // Debugging
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Cancel failed:', err.message);
      alert('Error cancelling booking');
    }
  };

  if (loading) return <p className="p-4">Loading bookings...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-4 border rounded shadow-md">
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Start Time:</strong> {booking.startTime}</p>
              <p><strong>End Time:</strong> {booking.endTime}</p>
              <p><strong>Seat:</strong> {booking.seat?.code || 'N/A'}</p>
              <button
                onClick={() => handleCancel(booking.id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowBooking;
