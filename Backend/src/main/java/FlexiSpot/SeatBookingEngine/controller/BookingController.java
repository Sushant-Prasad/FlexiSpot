package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.mapper.BookingMapper;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingMapper bookingMapper;

    // ===============================
    // Book a seat (JWT based)
    // ===============================
    @PostMapping
    public ResponseEntity<BookingDTO> bookSeat(
            @RequestBody BookingDTO bookingDTO,
            Authentication authentication
    ) {
        // 🔑 Email extracted from JWT
        String userEmail = authentication.getName();

        Booking booking = bookingService.bookSeat(bookingDTO, userEmail);
        return ResponseEntity.ok(bookingMapper.toDTO(booking));
    }

    // ===============================
    // Cancel booking (2-hour rule)
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // Get all bookings
    // ===============================
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
                        .stream()
                        .map(bookingMapper::toDTO)
                        .toList()
        );
    }

    // ===============================
    // Get 30-min time slots for seat
    // ===============================
    @GetMapping("/seat/{seatId}/timeslots")
    public ResponseEntity<List<TimeSlotStatus>> getTimeSlots(
            @PathVariable Long seatId,
            @RequestParam String date
    ) {
        return ResponseEntity.ok(
                bookingService.getTimeSlotStatusForSeat(
                        seatId,
                        LocalDate.parse(date)
                )
        );
    }
}
