package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
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

    // Book a room
    @PostMapping
    public ResponseEntity<MeetingBookingDTO> bookRoom(@RequestBody MeetingBookingDTO dto) {
        MeetingBookingDTO saved = bookingService.bookRoom(dto);
        return ResponseEntity.ok(saved);
    }

    //Get all bookings
    @GetMapping
    public ResponseEntity<List<MeetingBookingDTO>> getAllRoomBookings() {
        List<MeetingBookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Cancel booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRoomBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
