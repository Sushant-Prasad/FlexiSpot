package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepo extends JpaRepository<Seat, Long> {

    // ✅ Get only available seats
    List<Seat> findByIsAvailableTrue();

    // ✅ Get seats by optional filters (returns both available and booked seats)
    @Query("SELECT s FROM Seat s " +
            "WHERE (:location IS NULL OR s.location = :location) " +
            "AND (:building IS NULL OR s.building = :building) " +
            "AND (:floor IS NULL OR s.floor = :floor) " +
            "AND (:segment IS NULL OR s.segment = :segment)")
    List<Seat> findSeatsByFilters(@Param("location") String location,
                                  @Param("building") String building,
                                  @Param("floor") String floor,
                                  @Param("segment") String segment);
}
