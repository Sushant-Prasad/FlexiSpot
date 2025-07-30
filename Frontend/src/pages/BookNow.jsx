import { useState } from "react";
import Sidebar from "../components/SeatBookingEngine/Sidebar";
import { getFilteredSeats } from "../services/seatServices";
import { getFilteredMeetingRooms } from "../services/meetingRoomServices";
import { bookSeat } from "../services/bookingServices";
import { bookMeetingRoom } from "../services/meetinRoomBookingServices";
import SeatCard from "../components/SeatBookingEngine/SeatCard";
import MeetingRoomCard from "../components/SeatBookingEngine/MeetingRoomCard";
import BookingForm from "../components/SeatBookingEngine/BookingForm";
import toast from "react-hot-toast";
import { FiSearch, FiCalendar, FiMapPin } from "react-icons/fi";

const BookNow = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // seat or room
  const [selectedDate, setSelectedDate] = useState(""); // from sidebar
  const [selectedItem, setSelectedItem] = useState(null); // seat or room
  const [showForm, setShowForm] = useState(false);
  const [lastFilters, setLastFilters] = useState(null); //Store last filter
  const [loading, setLoading] = useState(false);

  // Fetch data based on filters
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
      setFilteredData([]);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show booking form
  const handleBookNow = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle seat or meeting room booking
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <FiCalendar className="text-2xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Book Workspace</h1>
        </div>
        <p className="text-gray-600">Find and book available seats or meeting rooms based on your preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiSearch className="mr-2" />
                Search & Filters
              </h2>
            </div>
            <div className="p-4">
              <Sidebar onApplyFilters={handleSidebarSearch} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedType === "seat"
                  ? "Available Seats"
                  : selectedType === "room"
                    ? "Available Meeting Rooms"
                    : "Search Results"}
              </h2>
              {selectedDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing results for {new Date(selectedDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for available options...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <FiMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    {selectedType ? `No ${selectedType === 'seat' ? 'seats' : 'meeting rooms'} found` : 'No results found'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedType
                      ? 'Try adjusting your filters or selecting a different date'
                      : 'Use the filters on the left to search for available options'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedType === "seat"
                    ? filteredData.map((seat) => (
                      <SeatCard key={seat.id} seat={seat} onBook={handleBookNow} />
                    ))
                    : filteredData.map((room) => (
                      <MeetingRoomCard key={room.id} room={room} onBook={handleBookNow} />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && selectedItem && (
        <BookingForm
          itemId={selectedItem.id}
          itemType={selectedType}
          userId={2}
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
