package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface MeetingBookingRepo extends JpaRepository<MeetingBooking, Long> {
    // All bookings for a date
    List<MeetingBooking> findByDate(LocalDate date);

    // All bookings for a date range (for usage analytics)
    List<MeetingBooking> findByDateBetween(LocalDate start, LocalDate end);


    // For time conflict check
    List<MeetingBooking> findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long roomId,
            LocalDate date,
            java.time.LocalTime endTime,
            java.time.LocalTime startTime
    );
}

