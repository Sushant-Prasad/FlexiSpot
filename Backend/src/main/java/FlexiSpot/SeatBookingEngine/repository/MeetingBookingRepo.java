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

    // =====================================
    // ✅ ONLY ACTIVE bookings (IMPORTANT)
    // =====================================
    List<MeetingBooking> findByRoomIdAndDateAndStatus(
            Long roomId,
            LocalDate date,
            BookingStatus status
    );

    // =====================================
    // ✅ Conflict check (ACTIVE only)
    // =====================================
    List<MeetingBooking> findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatus(
            Long roomId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime,
            BookingStatus status
    );
    // Used by AnalyticsService
    List<MeetingBooking> findByDate(LocalDate date);

    // =====================================
    // Scheduler: expire old bookings
    // =====================================
    @Query("""
        SELECT mb FROM MeetingBooking mb
        JOIN FETCH mb.room
        WHERE (mb.date < :today OR (mb.date = :today AND mb.endTime < :now))
        AND mb.status = :status
    """)
    List<MeetingBooking> findExpiredBookingsWithRoom(
            @Param("today") LocalDate today,
            @Param("now") LocalTime now,
            @Param("status") BookingStatus status
    );
    // Get all bookings for a specific room on a specific date
    List<MeetingBooking> findByRoomIdAndDate( Long roomId, LocalDate date );
}

