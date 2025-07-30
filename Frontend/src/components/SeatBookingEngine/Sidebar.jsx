import { useState } from "react";
import { FiSearch, FiCalendar, FiMapPin, FiHome, FiLayers, FiFilter } from "react-icons/fi";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    setIsLoading(true);

    try {
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
        await onApplyFilters(filters);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setLocation("");
    setCustomLocation("");
    setBuilding("");
    setCustomBuilding("");
    setFloor("");
    setCustomFloor("");
    setSegment("");
    setCustomSegment("");
  };

  const locations = ["Delhi", "Mumbai", "Pune", "Bangalore", "Hyderabad", "Other"];
  const buildings = ["Building A", "Building B", "Building C", "Main Office", "Annex", "Other"];
  const floors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "Other"];
  const segments = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Other"];

  const renderDropdown = (
    label,
    value,
    setValue,
    options,
    customValue,
    setCustomValue,
    icon
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
          placeholder={`Enter custom ${label.toLowerCase()}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Booking Type Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiFilter className="mr-2 text-blue-600" />
          Booking Options
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${type === "seat"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setType("seat")}
          >
            <div className="flex flex-col items-center">
              <FiMapPin className="text-lg mb-1" />
              <span className="text-sm">Book a Seat</span>
            </div>
          </button>
          <button
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${type === "room"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setType("room")}
          >
            <div className="flex flex-col items-center">
              <FiHome className="text-lg mb-1" />
              <span className="text-sm">Meeting Room</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiSearch className="mr-2 text-blue-600" />
          Search & Filters
        </h3>

        <div className="space-y-4">
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
            />
          </div>

          {/* Location */}
          {renderDropdown("Location", location, setLocation, locations, customLocation, setCustomLocation, <FiMapPin />)}

          {/* Building */}
          {renderDropdown("Building", building, setBuilding, buildings, customBuilding, setCustomBuilding, <FiHome />)}

          {/* Floor */}
          {renderDropdown("Floor", floor, setFloor, floors, customFloor, setCustomFloor, <FiLayers />)}

          {/* Segment (only for seats) */}
          {type === "seat" &&
            renderDropdown("Segment", segment, setSegment, segments, customSegment, setCustomSegment, <FiMapPin />)
          }
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              "Apply Filters"
            )}
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Select a date to see available options</li>
          <li>• Use filters to narrow down your search</li>
          <li>• Choose "Other" to enter custom values</li>
          <li>• Seats show segment options, rooms don't</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
