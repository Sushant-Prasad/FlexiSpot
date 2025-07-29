package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepo extends JpaRepository<MeetingRoom, Long> {

    // ✅ Get only available rooms
    List<MeetingRoom> findByIsAvailableTrue();

    // ✅ Get rooms by optional filters (returns both available and booked rooms)
    @Query("SELECT m FROM MeetingRoom m " +
            "WHERE (:location IS NULL OR m.location = :location) " +
            "AND (:building IS NULL OR m.building = :building) " +
            "AND (:floor IS NULL OR m.floor = :floor)")
    List<MeetingRoom> findRoomsByFilters(@Param("location") String location,
                                         @Param("building") String building,
                                         @Param("floor") String floor);

    // ✅ Extra Methods:

    // To check if a meeting room exists with the given room code (used to prevent duplicates)
    Optional<MeetingRoom> findByRoomCode(String roomCode);

    // To get all meeting rooms in a specific location
    List<MeetingRoom> findByLocation(String location);

    // To get all available rooms in a specific building
    List<MeetingRoom> findByBuildingAndIsAvailableTrue(String building);

    // To get all rooms on a specific floor of a building
    List<MeetingRoom> findByBuildingAndFloor(String building, String floor);
}
