package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.DTO.MeetingRoomDTO;
import FlexiSpot.SeatBookingEngine.service.MeetingRoomManagementService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting-room-management")
@CrossOrigin(origins = "*")
public class MeetingRoomManagementController {

    @Autowired
    private MeetingRoomManagementService meetingRoomManagementService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> createMeetingRoom(@Valid @RequestBody MeetingRoomDTO meetingRoomDTO) {
        try {
            MeetingRoomDTO created = meetingRoomManagementService.createMeetingRoom(meetingRoomDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // READ - Get all
    @GetMapping
    public ResponseEntity<List<MeetingRoomDTO>> getAllMeetingRooms() {
        return ResponseEntity.ok(meetingRoomManagementService.getAllMeetingRooms());
    }

    // READ - By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMeetingRoomById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(meetingRoomManagementService.getMeetingRoomById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Available rooms
    @GetMapping("/available")
    public ResponseEntity<List<MeetingRoomDTO>> getAvailableMeetingRooms() {
        return ResponseEntity.ok(meetingRoomManagementService.getAvailableMeetingRooms());
    }

    // READ - By filters
    @GetMapping("/filter")
    public ResponseEntity<List<MeetingRoomDTO>> getMeetingRoomsByFilters(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) String floor) {
        return ResponseEntity.ok(
                meetingRoomManagementService.getMeetingRoomsByFilters(location, building, floor)
        );
    }

    // UPDATE - Full update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeetingRoom(@PathVariable Long id, @Valid @RequestBody MeetingRoomDTO dto) {
        try {
            MeetingRoomDTO updated = meetingRoomManagementService.updateMeetingRoom(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE - Availability only
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestParam Boolean isAvailable) {
        try {
            MeetingRoomDTO updated = meetingRoomManagementService.updateMeetingRoomAvailability(id, isAvailable);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - Single
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeetingRoom(@PathVariable Long id) {
        try {
            meetingRoomManagementService.deleteMeetingRoom(id);
            return ResponseEntity.ok("Meeting room deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // BULK CREATE
    @PostMapping("/bulk")
    public ResponseEntity<?> createMultipleMeetingRooms(@Valid @RequestBody List<MeetingRoomDTO> dtos) {
        try {
            List<MeetingRoomDTO> created = meetingRoomManagementService.createMultipleMeetingRooms(dtos);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // BULK DELETE
    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteMultipleMeetingRooms(@RequestBody List<Long> ids) {
        try {
            meetingRoomManagementService.deleteMultipleMeetingRooms(ids);
            return ResponseEntity.ok("Meeting rooms deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
