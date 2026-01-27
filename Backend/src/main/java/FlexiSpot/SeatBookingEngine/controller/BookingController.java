package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.DTO.TimeSlotStatus;
import FlexiSpot.SeatBookingEngine.mapper.BookingMapper;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.service.BookingService;
import FlexiSpot.SeatBookingEngine.validation.OnUserBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingMapper bookingMapper;

    // ============================
    // Book a seat (JWT-based user)
    // ============================
    @Validated(OnUserBooking.class)
    @PostMapping
    public ResponseEntity<BookingDTO> bookSeat(
            @RequestBody BookingDTO bookingDTO,
            Authentication authentication
    ) {
        String userEmail = authentication.getName(); // extracted from JWT

        Booking savedBooking =
                bookingService.bookSeat(bookingDTO, userEmail);

        return ResponseEntity.ok(bookingMapper.toDTO(savedBooking));
    }

    // ======================================
    // Cancel a booking (2-hour restriction)
    // ======================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    // ======================================
    // Get available seats on a specific date
    // ======================================
    @GetMapping("/available-seats")
    public ResponseEntity<List<Seat>> getAvailableSeatsOnDate(
            @RequestParam("date") String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(
                bookingService.getAvailableSeatsOnDate(localDate)
        );
    }

    // ======================
    // Get all bookings
    // ======================
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();

        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookingDTOs);
    }

    // ==================================================
    // Get 30-min time slots for a seat on a given date
    // ==================================================
    @GetMapping("/seat/{seatId}/timeslots")
    public ResponseEntity<List<TimeSlotStatus>> getTimeSlotsForSeat(
            @PathVariable Long seatId,
            @RequestParam("date") String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<TimeSlotStatus> slots =
                bookingService.getTimeSlotStatusForSeat(seatId, localDate);

        return ResponseEntity.ok(slots);
    }
}
