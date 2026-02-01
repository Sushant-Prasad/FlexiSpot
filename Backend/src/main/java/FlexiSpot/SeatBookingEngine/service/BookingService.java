package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.repository.BookingRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import FlexiSpot.SeatBookingEngine.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.time.ZoneId;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private UserRepo userRepo;

    // ==================================================
    // Book a seat (JWT-based user + conflict validation)
    // ==================================================
    public Booking bookSeat(BookingDTO dto, String userEmail) {

        // --------- Validate time ---------
        if (dto.getStartTime() == null || dto.getEndTime() == null ||
                !dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new RuntimeException("❌ Invalid start or end time.");
        }

        if (!isAlignedTo30Min(dto.getStartTime()) || !isAlignedTo30Min(dto.getEndTime())) {
            throw new RuntimeException("❌ Booking time must be aligned to 30-minute slots.");
        }

        // --------- Fetch user from JWT ---------
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // --------- Fetch seat ---------
        Seat seat = seatRepo.findById(dto.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        LocalDate date = dto.getDate();
        LocalTime startTime = dto.getStartTime();
        LocalTime endTime = dto.getEndTime();

        // --------- Conflict check ---------
        List<Booking> conflicts =
                bookingRepo.findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatus(
                        seat.getId(),
                        date,
                        endTime,
                        startTime,
                        BookingStatus.ACTIVE
                );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("❌ Seat is already booked for one or more selected slots.");
        }

        // --------- Create booking ---------
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSeat(seat);
        booking.setDate(date);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.ACTIVE);

        // --------- Update seat availability (if booking is immediate) ---------
        if (date.equals(LocalDate.now())
                && startTime.isBefore(LocalTime.now().plusMinutes(30))) {
            seat.setIsAvailable(false);
            seatRepo.save(seat);
        }

        return bookingRepo.save(booking);
    }

    // 30-minute slot alignment check
    private boolean isAlignedTo30Min(LocalTime time) {
        return time.getMinute() == 0 || time.getMinute() == 30;
    }

    // ======================================
    // Cancel a booking (2-hour restriction)
    // ======================================
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime bookingStart =
                LocalDateTime.of(booking.getDate(), booking.getStartTime());

        LocalDateTime cancelDeadline = bookingStart.minusHours(2);

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));

        if (!now.isBefore(cancelDeadline)) {
            throw new IllegalStateException(
                    "❌ You cannot cancel the booking within 2 hours of the start time."
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);
    }


    // ======================================
    // Get available seats on a given date
    // ======================================
    public List<Seat> getAvailableSeatsOnDate(LocalDate date) {

        List<Booking> bookings =
                bookingRepo.findByDateAndStatus(date, BookingStatus.ACTIVE);

        List<Long> bookedSeatIds = bookings.stream()
                .map(b -> b.getSeat().getId())
                .distinct()
                .toList();

        return seatRepo.findAll().stream()
                .filter(seat ->
                        seat.getIsAvailable()
                                && !bookedSeatIds.contains(seat.getId())
                )
                .collect(Collectors.toList());
    }

    // ======================================
    // Get all bookings
    // ======================================
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // ======================================
    // Generate 30-min time slots for a seat
    // ======================================
    public List<TimeSlotStatus> getTimeSlotStatusForSeat(
            Long seatId,
            LocalDate date
    ) {

        List<Booking> bookings =
                bookingRepo.findBySeatIdAndDateAndStatus(
                        seatId,
                        date,
                        BookingStatus.ACTIVE
                );

        List<TimeSlotStatus> timeSlots = new ArrayList<>();

        LocalTime slotStart = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(18, 0);

        while (slotStart.isBefore(endTime)) {

            LocalTime slotEnd = slotStart.plusMinutes(30);

            final LocalTime tempStart = slotStart;
            final LocalTime tempEnd = slotEnd;

            Booking matchedBooking = bookings.stream()
                    .filter(b ->
                            b.getStartTime().isBefore(tempEnd)
                                    && b.getEndTime().isAfter(tempStart)
                    )
                    .findFirst()
                    .orElse(null);

            boolean isBooked = matchedBooking != null;

            TimeSlotStatus slot = isBooked
                    ? new TimeSlotStatus(
                    tempStart,
                    tempEnd,
                    true,
                    matchedBooking.getId(),
                    matchedBooking.getUser().getName()
            )
                    : new TimeSlotStatus(tempStart, tempEnd, false);

            timeSlots.add(slot);
            slotStart = slotEnd;
        }

        return timeSlots;
    }
}
