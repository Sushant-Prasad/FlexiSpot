package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.SeatRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seat-management")
public class SeatController {

    private final SeatRepository seatRepository;

    public SeatController(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // ✅ GET ALL SEATS
    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        return ResponseEntity.ok(seatRepository.findAll());
    }

    // ✅ CREATE SEAT (IMPORTANT FIX)
    @PostMapping
    public ResponseEntity<Seat> createSeat(@Valid @RequestBody Seat seat) {

        // 🔴 CRITICAL LINE (FIXES "id must not be null")
        seat.setId(null);

        Seat savedSeat = seatRepository.save(seat);
        return ResponseEntity.ok(savedSeat);
    }

    // ✅ UPDATE SEAT (IMPORTANT FIX)
    @PutMapping("/{id}")
    public ResponseEntity<Seat> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody Seat seat) {

        if (!seatRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 🔴 CRITICAL LINE
        seat.setId(id);

        Seat updatedSeat = seatRepository.save(seat);
        return ResponseEntity.ok(updatedSeat);
    }

    // ✅ DELETE SEAT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {

        if (!seatRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        seatRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ TOGGLE AVAILABILITY
    @PatchMapping("/{id}/availability")
    public ResponseEntity<Seat> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean isAvailable) {

        return seatRepository.findById(id)
                .map(seat -> {
                    seat.setIsAvailable(isAvailable);
                    return ResponseEntity.ok(seatRepository.save(seat));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
