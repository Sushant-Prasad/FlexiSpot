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

    // ==================================================
    // Book a meeting room (JWT-based user)
    // ==================================================
    public MeetingBookingDTO bookRoom(MeetingBookingDTO dto, String userEmail) {

        // 🔑 Fetch user from JWT email
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🏢 Fetch meeting room
        MeetingRoom room = meetingRoomRepo.findById(dto.getMeetingRoomId())
                .orElseThrow(() -> new RuntimeException("Meeting room not found"));

        LocalDate date = dto.getDate();
        LocalTime startTime = dto.getStartTime();
        LocalTime endTime = dto.getEndTime();

        // ⏱ Validate time
        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new RuntimeException("❌ Invalid start or end time.");
        }

        // Exactly 1 hour booking
        if (!startTime.plusHours(1).equals(endTime)) {
            throw new RuntimeException("❌ Meeting room bookings must be exactly 1 hour.");
        }

        // Align to full hour
        if (startTime.getMinute() != 0) {
            throw new RuntimeException("❌ Booking time must align to hourly slots.");
        }

        // ❗ Conflict check
        boolean conflict = !meetingBookingRepo
                .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        room.getId(),
                        date,
                        endTime,
                        startTime
                ).isEmpty();

        if (conflict) {
            throw new RuntimeException("❌ Room already booked for the selected time slot.");
        }

        // ✅ Create booking
        MeetingBooking booking = new MeetingBooking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setDate(date);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.ACTIVE);

        return mapper.toDTO(meetingBookingRepo.save(booking));
    }

    // ==================================================
    // Cancel meeting booking (3-hour restriction)
    // ==================================================
    public void cancelMeetingBooking(Long bookingId) {

        MeetingBooking booking = meetingBookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart =
                LocalDateTime.of(booking.getDate(), booking.getStartTime());

        if (now.plusHours(3).isAfter(bookingStart)) {
            throw new IllegalStateException(
                    "❌ Cannot cancel meeting within 3 hours of start time."
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        meetingBookingRepo.save(booking);

        // Restore room availability if no future active bookings
        MeetingRoom room = booking.getRoom();
        boolean hasOtherActiveBookings = meetingBookingRepo
                .findByRoomIdAndDateAndStatus(
                        room.getId(),
                        LocalDate.now(),
                        BookingStatus.ACTIVE
                )
                .stream()
                .anyMatch(b -> b.getEndTime().isAfter(LocalTime.now()));

        if (!hasOtherActiveBookings) {
            room.setIsAvailable(true);
            meetingRoomRepo.save(room);
        }
    }

    // ==================================================
    // Get all bookings
    // ==================================================
    public List<MeetingBookingDTO> getAllBookings() {
        return meetingBookingRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // ==================================================
    // Get 1-hour time slot status
    // ==================================================
    public List<TimeSlotStatus> getTimeSlotsForMeetingRoom(Long roomId, LocalDate date) {

        List<MeetingBooking> bookings =
                meetingBookingRepo.findByRoomIdAndDate(roomId, date);

        List<TimeSlotStatus> timeSlots = new ArrayList<>();

        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(18, 0);

        while (start.isBefore(end)) {
            LocalTime slotEnd = start.plusHours(1);
            final LocalTime slotStart = start;

            MeetingBooking matched = bookings.stream()
                    .filter(b ->
                            b.getStartTime().isBefore(slotEnd)
                                    && b.getEndTime().isAfter(slotStart)
                    )
                    .findFirst()
                    .orElse(null);

            if (matched != null) {
                timeSlots.add(
                        new TimeSlotStatus(
                                slotStart,
                                slotEnd,
                                true,
                                matched.getId(),
                                matched.getUser().getName()
                        )
                );
            } else {
                timeSlots.add(
                        new TimeSlotStatus(slotStart, slotEnd, false)
                );
            }

            start = slotEnd;
        }

        return timeSlots;
    }
}
