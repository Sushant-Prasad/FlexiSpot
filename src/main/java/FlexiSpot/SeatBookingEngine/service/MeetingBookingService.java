package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class MeetingBookingService {

    @Autowired
    private MeetingBookingRepo bookingRepo;

    @Autowired
    private MeetingRoomRepo roomRepo;

    // ✅ Book a meeting room
    public MeetingBooking bookRoom(MeetingBooking booking) {
        Long roomId = booking.getRoom().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        // 🔐 Check for conflicts
        boolean isConflict = !bookingRepo
                .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        roomId, date, endTime, startTime
                ).isEmpty();

        if (isConflict) {
            throw new RuntimeException("Room already booked for the selected time.");
        }

        // ✅ Mark room as unavailable
        MeetingRoom room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setIsAvailable(false);
        roomRepo.save(room);

        return bookingRepo.save(booking);
    }

    // ✅ Cancel a meeting room booking
    public void cancelBooking(Long bookingId) {
        MeetingBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        MeetingRoom room = booking.getRoom();

        // ✅ Make room available again
        room.setIsAvailable(true);
        roomRepo.save(room);

        bookingRepo.delete(booking);
    }

    // ✅ Get all bookings
    public List<MeetingBooking> getAllBookings() {
        return bookingRepo.findAll();
    }
}
