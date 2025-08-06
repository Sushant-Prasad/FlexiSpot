import { useState, useEffect } from "react";
import Sidebar from "../components/SeatBookingEngine/Sidebar";
import { getFilteredSeats } from "../services/seatServices";
import { getFilteredMeetingRooms } from "../services/meetingRoomServices";
import { bookSeat } from "../services/bookingServices";
import { bookMeetingRoom } from "../services/meetingRoomBookingServices";
import SeatCard from "../components/SeatBookingEngine/SeatCard";
import MeetingRoomCard from "../components/SeatBookingEngine/MeetingRoomCard";
import BookingForm from "../components/SeatBookingEngine/BookingForm";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiFilter,
  FiGrid,
  FiList,
} from "react-icons/fi";

const BookNow = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [lastFilters, setLastFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(parseInt(storedUserId));
  }, []);

  const handleSidebarSearch = async (filters) => {
    setSelectedType(filters.type);
    setSelectedDate(filters.date);
    setLastFilters(filters);
    setLoading(true);

    try {
      if (filters.type === "seat") {
        const seats = await getFilteredSeats({
          location: filters.location,
          building: filters.building,
          floor: filters.floor,
          segment: filters.segment,
        });
        setFilteredData(seats);
      } else {
        const rooms = await getFilteredMeetingRooms({
          location: filters.location,
          building: filters.building,
          floor: filters.floor,
        });
        setFilteredData(rooms);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      toast.error("Failed to fetch data. Please try again.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      if (selectedType === "seat") {
        await bookSeat(bookingData);
      } else if (selectedType === "room") {
        await bookMeetingRoom(bookingData);
      }

      toast.success("Booking successful!");
      setShowForm(false);
      setSelectedItem(null);

      if (lastFilters) {
        await handleSidebarSearch(lastFilters);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-2">
              <FiCalendar className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Workspace</h1>
                <p className="text-gray-600 mt-1">
                  Find and book available seats or meeting rooms based on your preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="xl:w-80 flex-shrink-0">
              <Sidebar onApplyFilters={handleSidebarSearch} />
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                        <FiSearch className="mr-2 text-blue-600" />
                        {selectedType === "seat"
                          ? "Available Seats"
                          : selectedType === "room"
                          ? "Available Meeting Rooms"
                          : "Search Results"}
                      </h2>
                      {selectedDate && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <FiCalendar className="mr-1" />
                          Showing results for{" "}
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {filteredData.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Found {filteredData.length}{" "}
                          {selectedType === "seat" ? "seat" : "meeting room"}
                          {filteredData.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {filteredData.length > 0 && (
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === "grid"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <FiGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded-md transition-colors ${
                            viewMode === "list"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <FiList className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 text-lg">Searching for available options...</p>
                      <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="text-center py-16">
                      <FiMapPin className="mx-auto text-6xl text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {selectedType
                          ? `No ${selectedType === "seat" ? "seats" : "meeting rooms"} found`
                          : "No results found"}
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        {selectedType
                          ? "Try adjusting your filters or selecting a different date to find available options."
                          : "Use the search filters on the left to find available seats or meeting rooms."}
                      </p>
                      {!selectedType && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-sm text-blue-800">
                            💡 <strong>Tip:</strong> Start by selecting a booking type and date,
                            then apply filters to narrow down your search.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          : "space-y-4"
                      }
                    >
                      {selectedType === "seat"
                        ? filteredData.map((seat) => (
                            <SeatCard
                              key={seat.id}
                              seat={seat}
                              onBook={handleBookNow}
                              viewMode={viewMode}
                            />
                          ))
                        : filteredData.map((room) => (
                            <MeetingRoomCard
                              key={room.id}
                              room={room}
                              onBook={handleBookNow}
                              viewMode={viewMode}
                            />
                          ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && selectedItem && userId && (
        <BookingForm
          itemId={selectedItem.id}
          itemType={selectedType}
          userId={userId}
          defaultDate={selectedDate}
          onSubmit={handleBookingSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default BookNow;