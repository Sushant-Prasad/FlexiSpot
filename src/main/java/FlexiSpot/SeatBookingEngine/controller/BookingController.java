package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Book a seat
    @PostMapping
    public ResponseEntity<Booking> bookSeat(@RequestBody Booking booking) {
        Booking savedBooking = bookingService.bookSeat(booking);
        return ResponseEntity.ok(savedBooking);
    }

    // Cancel a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
}

