import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking } from "../services/bookingServices";
import { getAllMeetingBookings, cancelMeetingBooking } from "../services/meetinRoomBookingServices";
import dayjs from "dayjs";

const ShowBooking = () => {
  const userId = 2; // Hardcoded user ID
  const [allBookings, setAllBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const seatBookings = await getAllBookings();
      const meetingBookings = await getAllMeetingBookings();

      // Merge and normalize data
      const formattedSeatBookings = seatBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "seat" }));

      const formattedMeetingBookings = meetingBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "meeting" }));

      setAllBookings([...formattedSeatBookings, ...formattedMeetingBookings]);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      if (booking.type === "seat") {
        await cancelBooking(booking.id);
      } else {
        await cancelMeetingBooking(booking.id);
      }
      alert("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = dayjs();

  const pastBookings = allBookings.filter((b) => dayjs(b.date).isBefore(now, "day"));
  const currentBookings = allBookings.filter((b) => !dayjs(b.date).isBefore(now, "day"));

  const renderBookingCard = (booking, isPast = false) => (
    <div key={`${booking.type}-${booking.id}`} className="p-4 border rounded shadow bg-white space-y-1">
      <p><strong>Type:</strong> {booking.type === "seat" ? "Seat Booking" : "Meeting Room"}</p>
      <p>
        <strong>{booking.type === "seat" ? "Seat Code" : "Meeting Room Code"}:</strong>{" "}
        {booking.seatCode || booking.meetingRoomCode}
      </p>
      <p><strong>Name:</strong> {booking.userName}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
      {!isPast && (
        <button
          onClick={() => handleCancel(booking)}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {/* Current / Upcoming Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Current / Upcoming Bookings</h2>
        {currentBookings.length === 0 ? (
          <p className="text-gray-500">No upcoming bookings.</p>
        ) : (
          <div className="space-y-4">{currentBookings.map((b) => renderBookingCard(b))}</div>
        )}
      </section>

      <hr className="my-6" />

      {/* Booking History */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Booking History</h2>
        {pastBookings.length === 0 ? (
          <p className="text-gray-500">No past bookings.</p>
        ) : (
          <div className="space-y-4">{pastBookings.map((b) => renderBookingCard(b, true))}</div>
        )}
      </section>
    </div>
  );
};

export default ShowBooking;
