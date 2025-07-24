package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.service.BookingRulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking-rules")
public class BookingRulesController {

    @Autowired
    private BookingRulesService bookingService;

    @PostMapping("/validate")
    public ResponseEntity<String> validateBooking(@RequestBody Booking booking) {
        try {
            bookingService.validateBooking(booking);
            return ResponseEntity.ok("Booking is valid.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Validation failed: " + e.getMessage());
        }
    }
}
