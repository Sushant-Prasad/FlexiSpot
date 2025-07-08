package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRoomRepo extends JpaRepository<MeetingRoom, Long> {

    //Get only available rooms
    List<MeetingRoom> findByIsAvailableTrue();

    //filter by location, building, floor
    List<MeetingRoom> findByLocationAndBuildingAndFloorAndIsAvailableTrue(
            String location,
            String building,
            String floor
    );
}

