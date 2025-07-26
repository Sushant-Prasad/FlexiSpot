import { useEffect, useState } from "react";
import { cancelBooking, getAllBookings } from "../services/bookingServices";
import { cancelMeetingBooking, getAllMeetingBookings } from "../services/meetinRoomBookingServices";
import dayjs from "dayjs";
import clsx from "clsx";
import { toast } from "react-hot-toast";


const ShowBooking = () => {
  const userId = 2; // Hardcoded user ID
  const [allBookings, setAllBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const seatBookings = await getAllBookings();
      const meetingBookings = await getAllMeetingBookings();

      const formattedSeatBookings = seatBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "seat" }));

      const formattedMeetingBookings = meetingBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "meeting" }));

      const all = [...formattedSeatBookings, ...formattedMeetingBookings];

      // Sort by date desc
      setAllBookings(all.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()));
    } catch (err) {
      console.error("❌ Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

 const handleCancel = async (booking) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    if (booking.type === "seat") {
      await cancelBooking(booking.id);
    } else {
      await cancelMeetingBooking(booking.id);
    }
    toast.success("Booking cancelled successfully.");
    fetchBookings();
  } catch (err) {
    toast.error("❌ Failed to cancel booking.");
    console.error(err);
  }
};


  const now = dayjs();

  // Booking is expired if the date+endTime is before now and it's marked EXPIRED
  const isExpired = (booking) => {
    const bookingEnd = dayjs(`${booking.date}T${booking.endTime}`);
    return booking.status === "EXPIRED" && bookingEnd.isBefore(now);
  };

  const currentBookings = allBookings.filter(
    (b) => b.status === "ACTIVE" && !isExpired(b)
  );

  const pastBookings = allBookings.filter(
    (b) => b.status === "CANCELLED" || isExpired(b)
  );

  const renderBookingCard = (booking, isPast = false) => {
    const expired = isExpired(booking);
    const isCancelled = booking.status === "CANCELLED";

    let badgeText = "Active";
    let badgeColor = "bg-green-500";

    if (isCancelled) {
      badgeText = "Cancelled";
      badgeColor = "bg-red-500";
    } else if (expired) {
      badgeText = "Expired";
      badgeColor = "bg-slate-500";
    }

    return (
      <div
        key={`${booking.type}-${booking.id}`}
        className="p-4 border rounded shadow bg-white space-y-1 relative"
      >
        <span
          className={clsx(
            "absolute top-2 right-2 px-2 py-1 text-xs text-white rounded",
            badgeColor
          )}
        >
          {badgeText}
        </span>

        <p><strong>Type:</strong> {booking.type === "seat" ? "Seat Booking" : "Meeting Room"}</p>
        <p>
          <strong>{booking.type === "seat" ? "Seat Code" : "Meeting Room Code"}:</strong>{" "}
          {booking.seatCode || booking.meetingRoomCode}
        </p>
        <p><strong>Name:</strong> {booking.userName}</p>
        <p><strong>Date:</strong> {dayjs(booking.date).format("DD MMM YYYY")}</p>
        <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>

        {!isPast && !isCancelled && !expired && (
          <button
            onClick={() => handleCancel(booking)}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Booking
          </button>
        )}
      </div>
    );
  };

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
