package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    // All bookings on a specific date
    List<Booking> findByDate(LocalDate date);

    // All bookings for a specific seat on a specific date
    List<Booking> findBySeatIdAndDate(Long seatId, LocalDate date);

    // Seat bookings filtered by status
    List<Booking> findBySeatIdAndDateAndStatus(Long seatId, LocalDate date, BookingStatus status);

    // Conflict check with overlapping times
    List<Booking> findBySeatIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatus(
            Long seatId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime,
            BookingStatus status
    );

    // Future active bookings for a seat
    List<Booking> findBySeatIdAndDateAndStartTimeGreaterThanEqualAndStatus(
            Long seatId,
            LocalDate date,
            LocalTime startTime,
            BookingStatus status
    );

    // Eagerly fetch expired bookings with Seat
    @Query("SELECT b FROM Booking b JOIN FETCH b.seat WHERE " +
            "(b.date < :currentDate OR (b.date = :currentDate AND b.endTime < :currentTime)) " +
            "AND b.status = :status")
    List<Booking> findExpiredBookingsWithSeat(
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("status") BookingStatus status
    );

    // Bookings by date and status
    List<Booking> findByDateAndStatus(LocalDate date, BookingStatus status);
}
