package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.service.MeetingBookingService;
import FlexiSpot.SeatBookingEngine.validation.OnUserBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meeting-bookings")
public class MeetingBookingController {

    @Autowired
    private MeetingBookingService bookingService;

    // ===============================
    // Book a meeting room (JWT based)
    // ===============================
    @Validated(OnUserBooking.class)
    @PostMapping
    public ResponseEntity<MeetingBookingDTO> bookRoom(
            @RequestBody MeetingBookingDTO dto,
            Authentication authentication
    ) {
        // 🔑 Extract email from JWT
        String userEmail = authentication.getName();

        MeetingBookingDTO saved =
                bookingService.bookRoom(dto, userEmail);

        return ResponseEntity.ok(saved);
    }

    // ===============================
    // Get all meeting room bookings
    // ===============================
    @GetMapping
    public ResponseEntity<List<MeetingBookingDTO>> getAllRoomBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ===============================
    // Cancel meeting booking (3-hour rule)
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRoomBooking(@PathVariable Long id) {
        try {
            bookingService.cancelMeetingBooking(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // ===============================
    // Get 1-hour time slots for room
    // ===============================
    @GetMapping("/room/{roomId}/timeslots")
    public ResponseEntity<List<TimeSlotStatus>> getTimeSlotsForRoom(
            @PathVariable Long roomId,
            @RequestParam("date") String date
    ) {
        return ResponseEntity.ok(
                bookingService.getTimeSlotsForMeetingRoom(
                        roomId,
                        LocalDate.parse(date)
                )
        );
    }
}
