import { useEffect, useState } from "react";
import { Armchair, MapPin, Building2, Layers, Rows3 } from "lucide-react";
import { getTimeSlotsForSeat } from "../../services/bookingServices";
import dayjs from "dayjs";

const SeatCard = ({ seat, onBook, viewMode = "grid" }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingLevel, setBookingLevel] = useState("green"); // green | orange | red
  const [loading, setLoading] = useState(true);
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const slots = await getTimeSlotsForSeat(seat.id, today);
        const totalSlots = slots.length;
        const bookedSlots = slots.filter((s) => s.booked).length;
        const percentage = (bookedSlots / totalSlots) * 100;

        if (percentage === 100) {
          setIsAvailable(false);
          setBookingLevel("red");
        } else if (percentage >= 50) {
          setBookingLevel("orange");
        } else {
          setBookingLevel("green");
        }
      } catch (err) {
        console.error("❌ Failed to fetch timeslots", err);
        setIsAvailable(false);
        setBookingLevel("red");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [seat.id]);

  const getStatusColor = () => {
    switch (bookingLevel) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = () => {
    if (loading) return "Loading...";
    if (!isAvailable) return "Fully Booked";
    switch (bookingLevel) {
      case "green":
        return "Available";
      case "orange":
        return "Limited Availability";
      case "red":
        return "Fully Booked";
      default:
        return "Unknown";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Armchair className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{seat.code}</h3>
                  <p className="text-sm text-gray-600">Seat</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="text-gray-400" size={14} />
                    <span>{seat.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="text-gray-400" size={14} />
                    <span>Building {seat.building}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Layers className="text-gray-400" size={14} />
                    <span>Floor {seat.floor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Rows3 className="text-gray-400" size={14} />
                    <span>Segment {seat.segment}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <button
              onClick={() => onBook(seat)}
              disabled={!isAvailable || loading}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors ${isAvailable && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? "Loading..." : isAvailable ? "Book Now" : "Not Available"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Armchair className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{seat.code}</h3>
            <p className="text-sm text-gray-600">Seat</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <MapPin className="text-gray-400" size={16} />
          <span className="text-gray-700">{seat.location}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Building2 className="text-gray-400" size={16} />
          <span className="text-gray-700">Building {seat.building}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Layers className="text-gray-400" size={16} />
          <span className="text-gray-700">Floor {seat.floor}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Rows3 className="text-gray-400" size={16} />
          <span className="text-gray-700">Segment {seat.segment}</span>
        </div>
      </div>

      <button
        onClick={() => onBook(seat)}
        disabled={!isAvailable || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${isAvailable && !loading
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        {loading ? "Loading..." : isAvailable ? "Book This Seat" : "Not Available"}
      </button>
    </div>
  );
};

export default SeatCard;
