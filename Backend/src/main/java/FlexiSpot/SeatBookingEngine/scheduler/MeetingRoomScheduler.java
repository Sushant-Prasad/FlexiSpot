package FlexiSpot.SeatBookingEngine.scheduler;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class MeetingRoomScheduler {

    @Autowired
    private MeetingBookingRepo meetingBookingRepo;

    @Autowired
    private MeetingRoomRepo meetingRoomRepo;

    // Scheduler runs every 5 minute to check and expire past bookings
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void expireMeetingRoomBookings() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        //  Use JOIN FETCH to eagerly load MeetingRoom and avoid LazyInitializationException
        List<MeetingBooking> expiredBookings =
                meetingBookingRepo.findExpiredBookingsWithRoom(today, now, BookingStatus.ACTIVE);

        for (MeetingBooking booking : expiredBookings) {
            booking.setStatus(BookingStatus.EXPIRED);
            meetingBookingRepo.save(booking);

            MeetingRoom room = booking.getRoom();

            // Check for future ACTIVE bookings for the same room today
            boolean hasFutureBookings = meetingBookingRepo
                    .findByRoomIdAndDateAndStatus(room.getId(), today, BookingStatus.ACTIVE)
                    .stream()
                    .anyMatch(b -> b.getEndTime().isAfter(now));

            if (!hasFutureBookings) {
                room.setIsAvailable(true);
                meetingRoomRepo.save(room);
            }
        }

        System.out.println(" MeetingRoomScheduler ran at " + now + " and expired " + expiredBookings.size() + " bookings.");
    }
}
