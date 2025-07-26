import { useState } from "react";

const Sidebar = ({ onApplyFilters }) => {
  // Helper to format today's date in YYYY-MM-DD
  const getFormattedDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [type, setType] = useState("seat");
  const [date, setDate] = useState(getFormattedDate);

  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  const [building, setBuilding] = useState("");
  const [customBuilding, setCustomBuilding] = useState("");

  const [floor, setFloor] = useState("");
  const [customFloor, setCustomFloor] = useState("");

  const [segment, setSegment] = useState("");
  const [customSegment, setCustomSegment] = useState("");

  const handleApplyFilters = () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const filters = {
      type,
      date,
      location: location === "Other" ? customLocation : location,
      building: building === "Other" ? customBuilding : building,
      floor: floor === "Other" ? customFloor : floor,
      ...(type === "seat" && {
        segment: segment === "Other" ? customSegment : segment,
      }),
    };

    if (typeof onApplyFilters === "function") {
      onApplyFilters(filters);
    }
  };

  const locations = ["Delhi", "Mumbai", "Pune", "Other"];
  const buildings = ["A", "B", "C", "Other"];
  const floors = ["1st", "2nd", "3rd", "Other"];
  const segments = ["Alpha", "Beta", "Gamma", "Other"];

  const renderDropdown = (
    label,
    value,
    setValue,
    options,
    customValue,
    setCustomValue
  ) => (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <select
        className="w-full border p-2 rounded mt-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {value === "Other" && (
        <input
          type="text"
          placeholder={`Enter ${label}`}
          className="w-full border p-2 rounded mt-2"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />
      )}
    </div>
  );

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
      <div className="flex flex-col gap-4 mb-4">
        <label className="text-sm font-medium text-gray-600">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />

        {renderDropdown("Location", location, setLocation, locations, customLocation, setCustomLocation)}
        {renderDropdown("Building", building, setBuilding, buildings, customBuilding, setCustomBuilding)}
        {renderDropdown("Floor", floor, setFloor, floors, customFloor, setCustomFloor)}

        {type === "seat" &&
          renderDropdown("Segment", segment, setSegment, segments, customSegment, setCustomSegment)}
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
