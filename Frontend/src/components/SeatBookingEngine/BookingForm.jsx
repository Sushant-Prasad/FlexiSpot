import { useState, useEffect } from "react";
import { getTimeSlotsForSeat } from "../../services/bookingServices";
import toast from "react-hot-toast";
import { getTimeSlotsForMeetingRoom } from "../../services/meetinRoomBookingServices";
import { FiCalendar, FiClock, FiX, FiCheck } from "react-icons/fi";

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

  const getSelectedTimeRange = () => {
    if (selectedIndices.length === 0) return "";
    const start = timeSlots[selectedIndices[0]].startTime;
    const end = timeSlots[selectedIndices[selectedIndices.length - 1]].endTime;
    return `${start} - ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Book {itemType === "seat" ? "Seat" : "Meeting Room"}
                </h2>
                <p className="text-sm text-gray-600">Select your preferred time slots</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiCalendar className="mr-2" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Selected Time Range Display */}
          {selectedIndices.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FiClock className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Selected Time:</span>
                <span className="text-sm text-blue-800">{getSelectedTimeRange()}</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {selectedIndices.length} slot{selectedIndices.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Time Slots */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FiClock className="mr-2" />
              <span>Select Time Slots</span>
            </label>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Loading time slots...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {timeSlots.map((slot, idx) => {
                  const slotDateTime = new Date(`${date}T${slot.startTime}`);
                  const now = new Date();
                  const isToday = new Date(date).toDateString() === now.toDateString();
                  const isPast = isToday && slotDateTime < now;
                  const isUnavailable = slot.booked || isPast;
                  const isSelected = selectedIndices.includes(idx);

                  return (
                    <div
                      key={idx}
                      className={`px-3 py-2 text-sm rounded-lg border text-center cursor-pointer transition-all duration-200 ${isUnavailable
                          ? "bg-red-50 text-red-600 border-red-200 cursor-not-allowed"
                          : isSelected
                            ? "bg-blue-500 text-white border-blue-600 shadow-sm"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      onClick={() => {
                        if (!isUnavailable) handleSlotClick(idx);
                      }}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        {isSelected && <FiCheck size={12} />}
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                      {slot.booked && slot.bookedBy && (
                        <div className="text-xs mt-1 opacity-75">
                          Booked by {slot.bookedBy}
                        </div>
                      )}
                      {isPast && !slot.booked && (
                        <div className="text-xs mt-1 opacity-75">
                          Past
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={selectedIndices.length === 0}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
