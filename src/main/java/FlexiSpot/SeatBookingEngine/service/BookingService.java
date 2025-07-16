package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.BookingRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private SeatRepo seatRepo;

    // Book a seat with time conflict validation and mark it unavailable
    public Booking bookSeat(Booking booking) {
        Long seatId = booking.getSeat().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        // Check if seat exists
        Seat seat = seatRepo.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // Check for time conflict
        List<Booking> conflicts = bookingRepo
                .findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        seatId, date, endTime, startTime
                );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Seat is already booked for the selected time slot.");
        }

        // Mark seat as unavailable
        seat.setIsAvailable(false);
        seatRepo.save(seat);

        return bookingRepo.save(booking);
    }

    // Cancel booking and make seat available again
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Seat seat = booking.getSeat();

        // Mark seat as available again
        seat.setIsAvailable(true);
        seatRepo.save(seat);

        bookingRepo.delete(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}
