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
import java.time.ZoneId;
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
    // Book a meeting room
    // ==================================================
    public MeetingBookingDTO bookRoom(MeetingBookingDTO dto, String userEmail) {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MeetingRoom room = meetingRoomRepo.findById(dto.getMeetingRoomId())
                .orElseThrow(() -> new RuntimeException("Meeting room not found"));

        LocalDate date = dto.getDate();
        LocalTime startTime = dto.getStartTime();
        LocalTime endTime = dto.getEndTime();

        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new RuntimeException("❌ Invalid start or end time.");
        }

        if (!startTime.plusHours(1).equals(endTime)) {
            throw new RuntimeException("❌ Meeting room bookings must be exactly 1 hour.");
        }

        if (startTime.getMinute() != 0) {
            throw new RuntimeException("❌ Booking must start on full hour.");
        }

        // ✅ ONLY ACTIVE bookings block availability
        boolean conflict = !meetingBookingRepo
                .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatus(
                        room.getId(),
                        date,
                        endTime,
                        startTime,
                        BookingStatus.ACTIVE
                ).isEmpty();

        if (conflict) {
            throw new RuntimeException("❌ Room already booked for this slot.");
        }

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
    // Cancel meeting booking (3-hour rule)
    // ==================================================
    public void cancelMeetingBooking(Long bookingId) {

        MeetingBooking booking = meetingBookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        ZoneId indiaZone = ZoneId.of("Asia/Kolkata");

        LocalDateTime bookingStart =
                LocalDateTime.of(booking.getDate(), booking.getStartTime());

        LocalDateTime cancelDeadline = bookingStart.minusHours(3);
        LocalDateTime now = LocalDateTime.now(indiaZone);

        if (!now.isBefore(cancelDeadline)) {
            throw new IllegalStateException(
                    "❌ You cannot cancel the meeting room within 3 hours of the start time."
            );
        }

        // ✅ JUST CANCEL — NO availability logic
        booking.setStatus(BookingStatus.CANCELLED);
        meetingBookingRepo.save(booking);
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
    // Get 1-hour time slots (SOURCE OF TRUTH)
    // ==================================================
    public List<TimeSlotStatus> getTimeSlotsForMeetingRoom(Long roomId, LocalDate date) {

        // ✅ ONLY ACTIVE bookings
        List<MeetingBooking> bookings =
                meetingBookingRepo.findByRoomIdAndDateAndStatus(
                        roomId,
                        date,
                        BookingStatus.ACTIVE
                );

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
                timeSlots.add(new TimeSlotStatus(
                        slotStart,
                        slotEnd,
                        true,
                        matched.getId(),
                        matched.getUser().getName()
                ));
            } else {
                timeSlots.add(new TimeSlotStatus(slotStart, slotEnd, false));
            }

            start = slotEnd;
        }

        return timeSlots;
    }
}
