import { useState, useEffect } from "react";
import { getTimeSlotsForSeat } from "../../services/bookingServices";
import { getTimeSlotsForMeetingRoom } from "../../services/meetingRoomBookingServices";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiX, FiCheck } from "react-icons/fi";

const BookingForm = ({
  itemId,
  itemType,
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
    const slotDateTime = new Date(`${date}T${slot.startTime}`);
    const now = new Date();

    const isToday = new Date(date).toDateString() === now.toDateString();
    const isPast = isToday && slotDateTime < now;

    if (slot.booked || isPast) return;

    const updated = [...selectedIndices];

    if (updated.includes(index)) {
      setSelectedIndices(updated.filter((i) => i !== index));
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

    const startTime = timeSlots[selectedIndices[0]].startTime;
    const endTime =
      timeSlots[selectedIndices[selectedIndices.length - 1]].endTime;

    const bookingData = {
      date,
      startTime,
      endTime,
      ...(itemType === "seat"
        ? { seatId: itemId }
        : { meetingRoomId: itemId }),
    };

    onSubmit(bookingData);
  };

  const getSelectedTimeRange = () => {
    if (!selectedIndices.length) return "";
    return `${timeSlots[selectedIndices[0]].startTime} - ${
      timeSlots[selectedIndices[selectedIndices.length - 1]].endTime
    }`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-blue-600" size={22} />
            <div>
              <h2 className="text-xl font-semibold">
                Book {itemType === "seat" ? "Seat" : "Meeting Room"}
              </h2>
              <p className="text-sm text-gray-600">
                Select your preferred time slots
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Date */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <FiCalendar /> Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Selected Time */}
          {selectedIndices.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <FiClock className="inline mr-2 text-blue-600" />
              Selected Time: <b>{getSelectedTimeRange()}</b>
            </div>
          )}

          {/* Slots */}
          {loading ? (
            <div className="text-center py-6">Loading slots...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {timeSlots.map((slot, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const isUnavailable = slot.booked;

                return (
                  <div
                    key={idx}
                    onClick={() => !isUnavailable && handleSlotClick(idx)}
                    className={`p-2 text-sm rounded-lg text-center border cursor-pointer ${
                      isUnavailable
                        ? "bg-red-100 text-red-600 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected && <FiCheck className="inline mr-1" />}
                    {slot.startTime} - {slot.endTime}
                  </div>
                );
              })}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={!selectedIndices.length}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
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
