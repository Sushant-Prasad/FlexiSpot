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

const BookNow = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // seat or room
  const [selectedDate, setSelectedDate] = useState(""); // from sidebar
  const [selectedItem, setSelectedItem] = useState(null); // seat or room
  const [showForm, setShowForm] = useState(false);
  const [lastFilters, setLastFilters] = useState(null); //Store last filter

  // Fetch data based on filters
  const handleSidebarSearch = async (filters) => {
    setSelectedType(filters.type);
    setSelectedDate(filters.date);
    setLastFilters(filters);

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
      toast.error("Booking failed.");
    }
  };

  return (
    <div className="flex">
      <Sidebar onApplyFilters={handleSidebarSearch} />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {selectedType === "seat"
            ? "Filtered Seats"
            : selectedType === "room"
            ? "Filtered Meeting Rooms"
            : "Results"}
        </h1>

        {filteredData.length === 0 ? (
          <p className="text-gray-500">No {selectedType} found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
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
