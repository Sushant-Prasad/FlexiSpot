package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
