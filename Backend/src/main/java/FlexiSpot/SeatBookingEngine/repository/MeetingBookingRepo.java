package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface MeetingBookingRepo extends JpaRepository<MeetingBooking, Long> {

    // Get all bookings for a specific date
    List<MeetingBooking> findByDate(LocalDate date);

    // Check for time conflict
    List<MeetingBooking> findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long roomId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime
    );
    List<MeetingBooking> findByRoomIdAndDateAndStatus(Long roomId, LocalDate date, BookingStatus status);

    @Query("SELECT mb FROM MeetingBooking mb JOIN FETCH mb.room WHERE (mb.date < :today OR (mb.date = :today AND mb.endTime < :now)) AND mb.status = :status")
    List<MeetingBooking> findExpiredBookingsWithRoom(LocalDate today, LocalTime now, BookingStatus status);



    // Get all bookings for a specific room on a specific date
    List<MeetingBooking> findByRoomIdAndDate(
            Long roomId,
            LocalDate date
    );
}
