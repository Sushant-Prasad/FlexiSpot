package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.BookingRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private SeatRepo seatRepo;

    //Book a seat
    public Booking bookSeat(Booking booking) {
        Seat seat = seatRepo.findById(booking.getSeat().getId())
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!seat.getIsAvailable()) {
            throw new RuntimeException("Seat is already booked");
        }

        seat.setIsAvailable(false); // Mark seat as booked
        seatRepo.save(seat);
        return bookingRepo.save(booking);
    }

    //Cancel a booking
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Seat seat = booking.getSeat();
        seat.setIsAvailable(true); // Make seat available again
        seatRepo.save(seat);

        bookingRepo.delete(booking);
    }

    //View all bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}
