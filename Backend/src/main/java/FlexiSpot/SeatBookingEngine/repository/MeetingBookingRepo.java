package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
