import { useState, useEffect } from "react";

const BookingForm = ({ itemId, itemType, userId, defaultDate, onSubmit, onClose }) => {
  const [date, setDate] = useState(defaultDate || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      alert("All fields are required");
      return;
    }

    const bookingData = {
      userId,
      date,
      startTime,
      endTime,
      ...(itemType === "seat" ? { seatId: itemId } : { roomId: itemId }),
    };

    onSubmit(bookingData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
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

          <label className="block text-sm font-medium text-gray-600">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-600">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-between">
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
