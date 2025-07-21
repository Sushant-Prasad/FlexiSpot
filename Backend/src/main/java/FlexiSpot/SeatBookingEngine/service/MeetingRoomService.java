package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingRoomService {

    @Autowired
    private MeetingRoomRepo roomRepo;

    //Get all available meeting rooms
    public List<MeetingRoom> getAllAvailableRooms() {
        return roomRepo.findByIsAvailableTrue();
    }

    //Filter meeting rooms
    public List<MeetingRoom> getFilteredRooms(String location, String building, String floor) {
        return roomRepo.findRoomsByFilters(location, building, floor);
    }

    //Get all meeting rooms
    public List<MeetingRoom> getAllRooms() {
        return roomRepo.findAll();
    }
}
