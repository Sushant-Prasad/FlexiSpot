package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.service.MeetingBookingService;
import FlexiSpot.SeatBookingEngine.validation.OnUserBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meeting-bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MeetingBookingController {

    @Autowired
    private MeetingBookingService bookingService;

    // Book a meeting room
    @Validated(OnUserBooking.class)
    @PostMapping
    public ResponseEntity<MeetingBookingDTO> bookRoom(@RequestBody MeetingBookingDTO dto) {
        MeetingBookingDTO saved = bookingService.bookRoom(dto);
        return ResponseEntity.ok(saved);
    }

    // Get all meeting room bookings
    @GetMapping
    public ResponseEntity<List<MeetingBookingDTO>> getAllRoomBookings() {
        List<MeetingBookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Cancel meeting room booking (with 3-hour restriction handling)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRoomBooking(@PathVariable Long id) {
        try {
            bookingService.cancelMeetingBooking(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 with error message
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage()); // 404 if booking not found
        }
    }

    // Get list of 1-hour time slots for a meeting room on a specific date
    @GetMapping("/room/{meetingRoomId}/timeslots")
    public ResponseEntity<List<TimeSlotStatus>> getTimeSlotsForMeetingRoom(
            @PathVariable Long meetingRoomId,
            @RequestParam("date") String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<TimeSlotStatus> slots = bookingService.getTimeSlotStatusForMeetingRoom(meetingRoomId, localDate);
        return ResponseEntity.ok(slots);
    }
}
