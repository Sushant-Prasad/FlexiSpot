package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    // Get bookings by date
    List<Booking> findByDate(LocalDate date);

    // Get all bookings for a seat on a specific date
    List<Booking> findBySeatIdAndDate(Long seatId, LocalDate date);

    // Check for overlapping bookings
    List<Booking> findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long seatId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime
    );
}
