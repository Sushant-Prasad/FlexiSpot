package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.MeetingRoomDTO;
import java.util.List;

public interface MeetingRoomManagementService {

    // Create
    MeetingRoomDTO createMeetingRoom(MeetingRoomDTO meetingRoomDTO);

    // Read
    List<MeetingRoomDTO> getAllMeetingRooms();
    MeetingRoomDTO getMeetingRoomById(Long id);
    List<MeetingRoomDTO> getAvailableMeetingRooms();
    List<MeetingRoomDTO> getMeetingRoomsByFilters(String location, String building, String floor);

    // Update
    MeetingRoomDTO updateMeetingRoom(Long id, MeetingRoomDTO meetingRoomDTO);
    MeetingRoomDTO updateMeetingRoomAvailability(Long id, Boolean isAvailable);

    // Delete
    void deleteMeetingRoom(Long id);

    // Bulk operations
    List<MeetingRoomDTO> createMultipleMeetingRooms(List<MeetingRoomDTO> meetingRoomDTOs);
    void deleteMultipleMeetingRooms(List<Long> ids);
}
