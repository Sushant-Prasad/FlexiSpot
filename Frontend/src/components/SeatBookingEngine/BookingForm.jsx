import { useState, useEffect } from "react";
import { getTimeSlotsForSeat } from "../../services/bookingServices";
import toast from "react-hot-toast";
import { getTimeSlotsForMeetingRoom } from "../../services/meetinRoomBookingServices";

const BookingForm = ({
  itemId,
  itemType,
  userId,
  defaultDate,
  onSubmit,
  onClose,
}) => {
  const [date, setDate] = useState(defaultDate || "");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const slots =
          itemType === "seat"
            ? await getTimeSlotsForSeat(itemId, date)
            : await getTimeSlotsForMeetingRoom(itemId, date);
        setTimeSlots(slots);
      } catch (err) {
        console.error("❌ Failed to fetch slots", err);
        toast.error("Failed to load time slots");
      } finally {
        setLoading(false);
        setSelectedIndices([]);
      }
    };

    if (date) fetchSlots();
  }, [date, itemId, itemType]);

  const handleSlotClick = (index) => {
    const slot = timeSlots[index];

    // Construct a DateTime from selected date and slot.startTime
    const slotDateTime = new Date(`${date}T${slot.startTime}`);
    const now = new Date();
    const isToday = new Date(date).toDateString() === now.toDateString();
    const isPast = isToday && slotDateTime < now;

    if (slot.booked || isPast) return;

    const updated = [...selectedIndices];
    const alreadySelected = updated.includes(index);

    if (alreadySelected) {
      const filtered = updated.filter((i) => i !== index);
      setSelectedIndices(filtered);
    } else {
      const newSelection = [...updated, index].sort((a, b) => a - b);
      const isContinuous = newSelection.every(
        (val, i, arr) => i === 0 || val === arr[i - 1] + 1
      );
      if (!isContinuous) {
        toast.error("Please select continuous time slots.");
        return;
      }
      setSelectedIndices(newSelection);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || selectedIndices.length === 0) {
      toast.error("Please select at least one time slot.");
      return;
    }

    const selectedStart = timeSlots[selectedIndices[0]].startTime;
    const selectedEnd =
      timeSlots[selectedIndices[selectedIndices.length - 1]].endTime;

    const bookingData = {
      userId,
      date,
      startTime: selectedStart,
      endTime: selectedEnd,
      ...(itemType === "seat" ? { seatId: itemId } : { meetingRoomId: itemId }),
    };

    onSubmit(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Book {itemType === "seat" ? "Seat" : "Meeting Room"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-600">
            Select Time Slots
          </label>
          {loading ? (
            <p className="text-sm text-gray-500">Loading time slots...</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {timeSlots.map((slot, idx) => {
                const slotDateTime = new Date(`${date}T${slot.startTime}`);
                const now = new Date();
                const isToday = new Date(date).toDateString() === now.toDateString();
                const isPast = isToday && slotDateTime < now;
                const isUnavailable = slot.booked || isPast;

                return (
                  <div
                    key={idx}
                    className={`px-2 py-1 text-sm rounded border text-center cursor-pointer
                      ${
                        isUnavailable
                          ? "bg-red-100 text-red-600 border-red-400 cursor-not-allowed"
                          : selectedIndices.includes(idx)
                          ? "bg-blue-500 text-white border-blue-700"
                          : "bg-green-100 text-green-700 border-green-400"
                      }`}
                    onClick={() => {
                      if (!isUnavailable) handleSlotClick(idx);
                    }}
                  >
                    {slot.startTime} - {slot.endTime}
                    {slot.booked && slot.bookedBy ? ` (by ${slot.bookedBy})` : ""}
                    {isPast && !slot.booked ? " (Past)" : ""}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm
            </button>
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
