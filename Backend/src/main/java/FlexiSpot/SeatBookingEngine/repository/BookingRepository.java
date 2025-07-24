package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Bookings for a specific date
    List<Booking> findByDate(LocalDate date);

    // Bookings for a date range (for usage heatmap)
    List<Booking> findByDateBetween(LocalDate start, LocalDate end);

    // Bookings for a specific seat+date, for conflict check
    List<Booking> findBySeatIdAndDate(Long seatId, LocalDate date);

    // Check for time conflicts
    List<Booking> findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long seatId,
            LocalDate date,
            java.time.LocalTime endTime,
            java.time.LocalTime startTime
    );



}


