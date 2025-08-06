package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.mapper.MeetingBookingMapper;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import FlexiSpot.SeatBookingEngine.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingBookingService {

    @Autowired
    private MeetingBookingRepo meetingBookingRepo;

    @Autowired
    private MeetingRoomRepo meetingRoomRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private MeetingBookingMapper mapper;

    // Book a meeting room with validations
    public MeetingBookingDTO bookRoom(MeetingBookingDTO dto) {
        MeetingBooking booking = mapper.toEntity(dto);

        Long roomId = booking.getRoom().getId();
        Long userId = booking.getUser().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        // Validate times
        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new RuntimeException("❌ Invalid start or end time.");
        }

        // Booking must be exactly 1 hour
        if (!startTime.plusHours(1).equals(endTime)) {
            throw new RuntimeException("❌ Meeting room bookings must be exactly 1 hour.");
        }

        // Must be aligned to full hours (e.g., 9:00, 10:00)
        if (startTime.getMinute() != 0 || endTime.getMinute() != 0) {
            throw new RuntimeException("❌ Booking time must align to hourly slots (e.g., 10:00 to 11:00).");
        }

        // Conflict check
        boolean isConflict = !meetingBookingRepo
                .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        roomId, date, endTime, startTime
                ).isEmpty();

        if (isConflict) {
            throw new RuntimeException("❌ Room already booked for the selected time slot.");
        }

        // Fetch room & user
        MeetingRoom room = meetingRoomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        booking.setRoom(room);
        booking.setUser(user);
        booking.setStatus(BookingStatus.ACTIVE);

        MeetingBooking saved = meetingBookingRepo.save(booking);
        return mapper.toDTO(saved);
    }

    // Cancel a booking (not allowed within 3 hours of start)
    public void cancelMeetingBooking(Long bookingId) {
        MeetingBooking booking = meetingBookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart = LocalDateTime.of(booking.getDate(), booking.getStartTime());

        if (now.plusHours(3).isAfter(bookingStart)) {
            throw new IllegalStateException("❌ Cannot cancel meeting within 3 hours of start time.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        meetingBookingRepo.save(booking);

        MeetingRoom room = booking.getRoom();
        boolean hasOtherActiveBookings = meetingBookingRepo
                .findByRoomIdAndDateAndStatus(room.getId(), LocalDate.now(), BookingStatus.ACTIVE)
                .stream()
                .anyMatch(b -> b.getEndTime().isAfter(LocalTime.now()));

        if (!hasOtherActiveBookings) {
            room.setIsAvailable(true);
            meetingRoomRepo.save(room);
        }
    }

    // Get all bookings
    public List<MeetingBookingDTO> getAllBookings() {
        return meetingBookingRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get 1-hour time slot status for a meeting room
    public List<TimeSlotStatus> getTimeSlotStatusForMeetingRoom(Long roomId, LocalDate date) {
        List<MeetingBooking> bookings = meetingBookingRepo.findByRoomIdAndDate(roomId, date);
        List<TimeSlotStatus> timeSlots = new ArrayList<>();

        LocalTime start = LocalTime.of(9, 0); // Working hours start
        LocalTime end = LocalTime.of(18, 0);  // Working hours end

        while (start.isBefore(end)) {
            LocalTime slotEnd = start.plusHours(1);
            final LocalTime slotStart = start;
            final LocalTime slotEndCopy = slotEnd;

            MeetingBooking matched = bookings.stream()
                    .filter(b -> b.getStartTime().isBefore(slotEndCopy) && b.getEndTime().isAfter(slotStart))
                    .findFirst()
                    .orElse(null);

            if (matched != null) {
                timeSlots.add(new TimeSlotStatus(
                        slotStart,
                        slotEndCopy,
                        true,
                        matched.getId(),
                        matched.getUser().getName()
                ));
            } else {
                timeSlots.add(new TimeSlotStatus(slotStart, slotEndCopy, false));
            }

            start = slotEnd;
        }

        return timeSlots;
    }
}
