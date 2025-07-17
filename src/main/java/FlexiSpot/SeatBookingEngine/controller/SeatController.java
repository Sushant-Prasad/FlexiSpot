package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend access
public class SeatController {

    @Autowired
    private SeatRepo seatRepo;

    //Get all available seats or filtered by location/building/floor/segment
    @GetMapping
    public ResponseEntity<List<Seat>> getFilteredSeats(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) String floor,
            @RequestParam(required = false) String segment
    ) {
        List<Seat> seats = seatRepo.findSeatsByFilters(location, building, floor, segment);
        return ResponseEntity.ok(seats);
    }
    //Get all available seats
    @GetMapping("/available")
    public ResponseEntity<List<Seat>> getAvailableSeats() {
        return ResponseEntity.ok(seatRepo.findByIsAvailableTrue());
    }


    //Get all seats
    @GetMapping("/all")
    public ResponseEntity<List<Seat>> getAllSeats() {
        return ResponseEntity.ok(seatRepo.findAll());
    }
}
