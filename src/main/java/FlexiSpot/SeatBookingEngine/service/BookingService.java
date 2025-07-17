package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.repository.BookingRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import FlexiSpot.SeatBookingEngine.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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

    // Book a seat with time conflict validation and mark it unavailable
    public Booking bookSeat(Booking booking) {
        Long seatId = booking.getSeat().getId();
        Long userId = booking.getUser().getId();
        LocalDate date = booking.getDate();
        LocalTime startTime = booking.getStartTime();
        LocalTime endTime = booking.getEndTime();

        //Fetch full user and seat from DB
        Seat seat = seatRepo.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //Check for time conflict
        List<Booking> conflicts = bookingRepo
                .findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                        seatId, date, endTime, startTime
                );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Seat is already booked for the selected time slot.");
        }

        // ark seat as unavailable
        seat.setIsAvailable(false);
        seatRepo.save(seat);

        //Set full entities before saving
        booking.setUser(user);
        booking.setSeat(seat);

        return bookingRepo.save(booking);
    }

    //Cancel booking and make seat available again
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Seat seat = booking.getSeat();

        //Mark seat as available again
        seat.setIsAvailable(true);
        seatRepo.save(seat);

        bookingRepo.delete(booking);
    }
    //Get all available seats on a specific date
    public List<Seat> getAvailableSeatsOnDate(LocalDate date) {
        List<Booking> bookings = bookingRepo.findByDate(date);
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
}
