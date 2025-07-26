package FlexiSpot.SeatBookingEngine.service;

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

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private UserRepo userRepo;

    // Book a seat with conflict validation
    public Booking bookSeat(Booking booking) {
        Long seatId = booking.getSeat().getId();
        Long userId = booking.getUser().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new RuntimeException("❌ Invalid start or end time.");
        }

        if (!isAlignedTo30Min(startTime) || !isAlignedTo30Min(endTime)) {
            throw new RuntimeException("❌ Booking time must be aligned to 30-minute slots.");
        }

        Seat seat = seatRepo.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Conflict check with existing ACTIVE bookings
        List<Booking> conflicts = bookingRepo
                .findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatus(
                        seatId, date, endTime, startTime, BookingStatus.ACTIVE);

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("❌ Seat is already booked for one or more selected slots.");
        }

        booking.setUser(user);
        booking.setSeat(seat);
        booking.setStatus(BookingStatus.ACTIVE);

        // Mark seat unavailable if booking is for now
        if (date.equals(LocalDate.now()) && startTime.isBefore(LocalTime.now().plusMinutes(30))) {
            seat.setIsAvailable(false);
            seatRepo.save(seat);
        }

        return bookingRepo.save(booking);
    }

    private boolean isAlignedTo30Min(LocalTime time) {
        return time.getMinute() == 0 || time.getMinute() == 30;
    }


    // Cancel a booking (soft cancel with status)
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingStart = LocalDateTime.of(booking.getDate(), booking.getStartTime());

        if (now.plusHours(2).isAfter(bookingStart)) {
            throw new IllegalStateException("You cannot cancel the booking within 2 hours of the time slot.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);

        // Update seat availability if no future active bookings
        List<Booking> futureBookings = bookingRepo
                .findBySeatIdAndDateAndStartTimeGreaterThanEqualAndStatus(
                        booking.getSeat().getId(), LocalDate.now(), LocalTime.now(), BookingStatus.ACTIVE);

        if (futureBookings.isEmpty()) {
            Seat seat = booking.getSeat();
            seat.setIsAvailable(true);
            seatRepo.save(seat);
        }
    }

    // Get available seats on a date
    public List<Seat> getAvailableSeatsOnDate(LocalDate date) {
        List<Booking> bookings = bookingRepo.findByDateAndStatus(date, BookingStatus.ACTIVE);
        List<Long> bookedSeatIds = bookings.stream()
                .map(b -> b.getSeat().getId())
                .distinct()
                .toList();

        return seatRepo.findAll().stream()
                .filter(seat -> seat.getIsAvailable() && !bookedSeatIds.contains(seat.getId()))
                .collect(Collectors.toList());
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // Generate 30-min time slots with booking info
    public List<TimeSlotStatus> getTimeSlotStatusForSeat(Long seatId, LocalDate date) {
        List<Booking> bookings = bookingRepo.findBySeatIdAndDateAndStatus(seatId, date, BookingStatus.ACTIVE);

        List<TimeSlotStatus> timeSlots = new ArrayList<>();
        LocalTime slotStart = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(18, 0);

        while (slotStart.isBefore(endTime)) {
            LocalTime slotEnd = slotStart.plusMinutes(30);

            final LocalTime tempStart = slotStart;
            final LocalTime tempEnd = slotEnd;

            Booking matchedBooking = bookings.stream()
                    .filter(booking ->
                            booking.getStartTime().isBefore(tempEnd) &&
                                    booking.getEndTime().isAfter(tempStart)
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
                    matchedBooking.getUser() != null ? matchedBooking.getUser().getName() : null
            )
                    : new TimeSlotStatus(tempStart, tempEnd, false);

            timeSlots.add(slot);
            slotStart = slotEnd;
        }

        return timeSlots;
    }
}
