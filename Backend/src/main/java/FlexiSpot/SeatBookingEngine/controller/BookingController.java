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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingMapper bookingMapper;

    //Book a seat
    @Validated(OnUserBooking.class)
    @PostMapping
    public ResponseEntity<BookingDTO> bookSeat(@RequestBody BookingDTO bookingDTO) {
        Booking booking = bookingMapper.toEntity(bookingDTO);
        Booking savedBooking = bookingService.bookSeat(booking);
        return ResponseEntity.ok(bookingMapper.toDTO(savedBooking));
    }

    // Cancel a booking (user NOT allowed to cancel within 2 hours of the booking start time)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    // Get all available seats on a specific date
    @GetMapping("/available-seats")
    public ResponseEntity<List<Seat>> getAvailableSeatsOnDate(@RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(bookingService.getAvailableSeatsOnDate(localDate));
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    // Get list of 30-minute time slots for a seat on a specific date
    @GetMapping("/seat/{seatId}/timeslots")
    public ResponseEntity<List<TimeSlotStatus>> getTimeSlotsForSeat(
            @PathVariable Long seatId,
            @RequestParam("date") String date
    ) {
        LocalDate localDate = LocalDate.parse(date);
        List<TimeSlotStatus> slots = bookingService.getTimeSlotStatusForSeat(seatId, localDate);
        return ResponseEntity.ok(slots);
    }
}
