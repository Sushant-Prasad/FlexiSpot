package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingBookingRepo extends JpaRepository<MeetingBooking, Long> {

    //Get all bookings by date
    List<MeetingBooking> findByDate(LocalDate date);

    // Check if a room is already booked for the same date and time
    List<MeetingBooking> findByRoomIdAndDateAndTimeSlot(Long roomId, LocalDate date, String timeSlot);
}
