package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.service.MeetingBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class MeetingBookingController {

    @Autowired
    private MeetingBookingService bookingService;

    //Book a meeting room
    @PostMapping
    public ResponseEntity<MeetingBooking> bookRoom(@RequestBody MeetingBooking booking) {
        return ResponseEntity.ok(bookingService.bookRoom(booking));
    }

    //Cancel a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    //View all bookings
    @GetMapping
    public ResponseEntity<List<MeetingBooking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}

