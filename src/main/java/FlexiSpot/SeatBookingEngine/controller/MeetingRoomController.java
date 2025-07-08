package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class MeetingRoomController {

    @Autowired
    private MeetingRoomService roomService;

    //Get all available rooms
    @GetMapping
    public ResponseEntity<List<MeetingRoom>> getAvailableRooms(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) String floor
    ) {
        if (location != null && building != null && floor != null) {
            return ResponseEntity.ok(roomService.getFilteredRooms(location, building, floor));
        }
        return ResponseEntity.ok(roomService.getAllAvailableRooms());
    }

    //Get all rooms (optional)
    @GetMapping("/all")
    public ResponseEntity<List<MeetingRoom>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }
}

