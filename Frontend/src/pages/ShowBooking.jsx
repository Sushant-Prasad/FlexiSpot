import { useEffect, useState } from "react";
import { cancelBooking, getAllBookings } from "../services/bookingServices";
import { cancelMeetingBooking, getAllMeetingBookings } from "../services/meetingRoomBookingServices";
import dayjs from "dayjs";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiUser, FiX } from "react-icons/fi";

const ShowBooking = () => {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to view bookings.");
      navigate("/login");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const seatBookings = await getAllBookings();
      const meetingBookings = await getAllMeetingBookings();

      const formattedSeatBookings = seatBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "seat" }));

      const formattedMeetingBookings = meetingBookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, type: "meeting" }));

      const all = [...formattedSeatBookings, ...formattedMeetingBookings];
      setAllBookings(all.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()));
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
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
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      toast.error("❌ Failed to cancel booking.");
      console.error(err);
    }
  };

  const now = dayjs();
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
    let badgeIcon = FiClock;

    if (isCancelled) {
      badgeText = "Cancelled";
      badgeColor = "bg-red-500";
      badgeIcon = FiX;
    } else if (expired) {
      badgeText = "Expired";
      badgeColor = "bg-slate-500";
      badgeIcon = FiClock;
    }

    const BadgeIcon = badgeIcon;

    return (
      <div
        key={`${booking.type}-${booking.id}`}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${booking.type === 'seat' ? 'bg-blue-100' : 'bg-green-100'}`}> 
              {booking.type === 'seat' ? (
                <FiUser className="text-blue-600" />
              ) : (
                <FiCalendar className="text-green-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.type === "seat" ? "Seat Booking" : "Meeting Room"}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.seatCode || booking.meetingRoomCode}
              </p>
            </div>
          </div>
          <span
            className={clsx(
              "px-3 py-1 text-xs font-medium text-white rounded-full flex items-center space-x-1",
              badgeColor
            )}
          >
            <BadgeIcon className="text-xs" />
            <span>{badgeText}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <FiUser className="text-gray-400" />
            <span className="text-gray-600">{booking.userName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <span className="text-gray-600">
              {dayjs(booking.date).format("DD MMM YYYY")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="text-gray-400" />
            <span className="text-gray-600">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>

        {!isPast && !isCancelled && !expired && (
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => handleCancel(booking)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <FiCalendar className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <FiCalendar className="text-2xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        </div>
        <p className="text-gray-600">View and manage your workspace bookings.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current / Upcoming Bookings</h2>
          <p className="text-sm text-gray-600 mt-1">
            {currentBookings.length} active booking{currentBookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-6">
          {currentBookings.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No upcoming bookings</p>
            </div>
          ) : (
            <div className="grid gap-6">{currentBookings.map((b) => renderBookingCard(b))}</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pastBookings.length} past booking{pastBookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-6">
          {pastBookings.length === 0 ? (
            <div className="text-center py-8">
              <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No past bookings</p>
            </div>
          ) : (
            <div className="grid gap-6">{pastBookings.map((b) => renderBookingCard(b, true))}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowBooking;