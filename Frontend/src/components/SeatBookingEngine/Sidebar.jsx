import { useState } from "react";

const Sidebar = ({ onApplyFilters }) => {
  const [type, setType] = useState("seat");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [segment, setSegment] = useState("");

  const handleApplyFilters = () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const filters = {
      type,
      date,
      location,
      building,
      floor,
      ...(type === "seat" && { segment }),
    };

    if (typeof onApplyFilters === "function") {
      onApplyFilters(filters);
    } else {
      console.warn("onApplyFilters prop is not a function");
    }
  };

  return (
    <div className="w-full md:w-1/4 p-4 border-r bg-gray-50 shadow-sm min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Booking Options</h2>

      {/* Type Toggle */}
      <div className="flex flex-col gap-2 mb-4">
        <button
          className={`py-2 px-3 rounded ${
            type === "seat" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setType("seat")}
        >
          Book a Seat
        </button>
        <button
          className={`py-2 px-3 rounded ${
            type === "room" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setType("room")}
        >
          Book a Meeting Room
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Building"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="border p-2 rounded"
        />
        {type === "seat" && (
          <input
            type="text"
            placeholder="Segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="border p-2 rounded"
          />
        )}
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Sidebar;
