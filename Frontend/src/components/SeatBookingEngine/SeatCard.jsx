import { useEffect, useState } from "react";
import { Armchair, MapPin, Building2, Layers, Rows3 } from "lucide-react";
import { getTimeSlotsForSeat } from "../../services/bookingServices";
import dayjs from "dayjs";

const SeatCard = ({ seat, onBook }) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookingLevel, setBookingLevel] = useState("green"); // green | orange | red
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
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
      }
    };

    fetchSlots();
  }, [seat.id]);

  const borderClass =
    bookingLevel === "green"
      ? "border-green-500 bg-green-50"
      : bookingLevel === "orange"
      ? "border-yellow-500 bg-yellow-50"
      : "border-red-500 bg-red-50";

  const buttonClass =
    isAvailable
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-400 text-white cursor-not-allowed";

  return (
    <div className={`p-4 rounded shadow-md border-2 ${borderClass}`}>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Armchair className="text-blue-600" size={20} />
        Seat Code: {seat.code}
      </h2>

      <div className="text-sm space-y-1 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> Location: {seat.location}
        </p>
        <p className="flex items-center gap-2">
          <Building2 size={16} /> Building: {seat.building}
        </p>
        <p className="flex items-center gap-2">
          <Layers size={16} /> Floor: {seat.floor}
        </p>
        <p className="flex items-center gap-2">
          <Rows3 size={16} /> Segment: {seat.segment}
        </p>
      </div>

      <button
        onClick={() => onBook(seat)}
        disabled={!isAvailable}
        className={`mt-4 w-full py-2 rounded ${buttonClass}`}
      >
        {isAvailable ? "Book Now" : "Fully Booked"}
      </button>
    </div>
  );
};

export default SeatCard;
