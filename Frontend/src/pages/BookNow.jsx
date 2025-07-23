import { useState } from "react";
import { getAvailableSeatsByDate, bookSeat } from "../services/bookingServices";
import { getAllMeetingRooms } from "../services/meetingRoomServices";
import { bookMeetingRoom } from "../services/meetinRoomBookingServices";

const BookNow = () => {
  const [type, setType] = useState("seat"); // "seat" or "room"
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [availableItems, setAvailableItems] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      if (!date) return alert("Please select a date");
      let items = [];

      if (type === "seat") {
        items = await getAvailableSeatsByDate(date);
      } else {
        items = await getAllMeetingRooms(location, building, floor);
      }

      setAvailableItems(items);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setMessage("Failed to fetch availability");
    }
  };

  const handleBooking = async (item) => {
    const payload = {
      userId: 2,
      date,
      startTime: "10:00:00",
      endTime: "12:00:00",
    };

    try {
      if (type === "seat") {
        await bookSeat({ ...payload, seatId: item.id });
      } else {
        await bookMeetingRoom({ ...payload, meetingRoomId: item.id });
      }

      setMessage("Booking successful!");
      handleSearch(); // refresh list
    } catch (err) {
      console.error("Booking failed:", err);
      setMessage("Booking failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book a {type === "seat" ? "Seat" : "Meeting Room"}</h1>

      {/* Type Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${type === "seat" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setType("seat")}
        >
          Seat
        </button>
        <button
          className={`px-4 py-2 rounded ${type === "room" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setType("room")}
        >
          Meeting Room
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Building"
          className="border p-2 rounded"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />
        <input
          type="text"
          placeholder="Floor"
          className="border p-2 rounded"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        />
      </div>

      <button onClick={handleSearch} className="px-6 py-2 bg-green-600 text-white rounded">
        Search Available {type === "seat" ? "Seats" : "Rooms"}
      </button>

      {/* Result List */}
      {message && <p className="mt-4 text-red-600">{message}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {availableItems.length === 0 ? (
          <p>No {type === "seat" ? "seats" : "rooms"} found</p>
        ) : (
          availableItems.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow-sm">
              <p>
                <strong>{type === "seat" ? "Seat Code" : "Room Name"}:</strong>{" "}
                {type === "seat" ? item.code : item.roomCode}
              </p>
              <button
                onClick={() => handleBooking(item)}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Book
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookNow;
