package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.SeatDTO;
import FlexiSpot.SeatBookingEngine.service.SeatManagementService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seat-management")
@CrossOrigin(origins = "*")
public class SeatManagementController {

    @Autowired
    private SeatManagementService seatManagementService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> createSeat(@Valid @RequestBody SeatDTO seatDTO) {
        try {
            SeatDTO created = seatManagementService.createSeat(seatDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - All seats
    @GetMapping
    public ResponseEntity<List<SeatDTO>> getAllSeats() {
        return ResponseEntity.ok(seatManagementService.getAllSeats());
    }

    // READ - By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSeatById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(seatManagementService.getSeatById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Available only
    @GetMapping("/available")
    public ResponseEntity<List<SeatDTO>> getAvailableSeats() {
        return ResponseEntity.ok(seatManagementService.getAvailableSeats());
    }

    // READ - Filtered
    @GetMapping("/filter")
    public ResponseEntity<List<SeatDTO>> getSeatsByFilters(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) String floor,
            @RequestParam(required = false) String segment) {
        return ResponseEntity.ok(
                seatManagementService.getSeatsByFilters(location, building, floor, segment)
        );
    }

    // UPDATE - Full update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSeat(@PathVariable Long id, @Valid @RequestBody SeatDTO seatDTO) {
        try {
            return ResponseEntity.ok(seatManagementService.updateSeat(id, seatDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Availability only
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateSeatAvailability(@PathVariable Long id, @RequestParam Boolean isAvailable) {
        try {
            return ResponseEntity.ok(seatManagementService.updateSeatAvailability(id, isAvailable));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Single
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeat(@PathVariable Long id) {
        try {
            seatManagementService.deleteSeat(id);
            return ResponseEntity.ok("Seat deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // BULK CREATE
    @PostMapping("/bulk")
    public ResponseEntity<?> createMultipleSeats(@Valid @RequestBody List<SeatDTO> dtos) {
        try {
            List<SeatDTO> created = seatManagementService.createMultipleSeats(dtos);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // BULK DELETE
    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteMultipleSeats(@RequestBody List<Long> ids) {
        try {
            seatManagementService.deleteMultipleSeats(ids);
            return ResponseEntity.ok("Seats deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

