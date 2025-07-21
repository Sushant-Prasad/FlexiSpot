package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.mapper.MeetingBookingMapper;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import FlexiSpot.SeatBookingEngine.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingBookingService {

    @Autowired
    private MeetingBookingRepo bookingRepo;

    @Autowired
    private MeetingRoomRepo roomRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MeetingBookingMapper mapper;

    //Book a meeting room and return DTO with populated names
    public MeetingBookingDTO bookRoom(MeetingBookingDTO dto) {
        MeetingBooking booking = mapper.toEntity(dto);

        Long roomId = booking.getRoom().getId();
        Long userId = booking.getUser().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        // Check for conflict
        boolean isConflict = !bookingRepo
                .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        roomId, date, endTime, startTime
                ).isEmpty();

        if (isConflict) {
            throw new RuntimeException("Room already booked for the selected time.");
        }

        // Fetch and set full room and user to avoid null names in DTO
        MeetingRoom room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        booking.setRoom(room);
        booking.setUser(user);

        // Mark room as unavailable
        room.setIsAvailable(false);
        roomRepo.save(room);

        MeetingBooking saved = bookingRepo.save(booking);
        return mapper.toDTO(saved);
    }

    // Cancel a booking
    public void cancelBooking(Long bookingId) {
        MeetingBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        MeetingRoom room = booking.getRoom();
        room.setIsAvailable(true);
        roomRepo.save(room);

        bookingRepo.delete(booking);
    }

    // Get all bookings
    public List<MeetingBookingDTO> getAllBookings() {
        return bookingRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
