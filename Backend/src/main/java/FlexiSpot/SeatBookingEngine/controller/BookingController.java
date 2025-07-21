package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.mapper.BookingMapper;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingMapper bookingMapper;

    //Book a seat
    @PostMapping
    public ResponseEntity<BookingDTO> bookSeat(@RequestBody BookingDTO bookingDTO) {
        Booking booking = bookingMapper.toEntity(bookingDTO);
        Booking savedBooking = bookingService.bookSeat(booking);
        return ResponseEntity.ok(bookingMapper.toDTO(savedBooking));
    }

    //Cancel a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    //Get all available seats on a specific date
    @GetMapping("/available-seats")
    public ResponseEntity<List<Seat>> getAvailableSeatsOnDate(@RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date); // Fixed typo here
        return ResponseEntity.ok(bookingService.getAvailableSeatsOnDate(localDate));
    }

    //Get all bookings
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }
}
