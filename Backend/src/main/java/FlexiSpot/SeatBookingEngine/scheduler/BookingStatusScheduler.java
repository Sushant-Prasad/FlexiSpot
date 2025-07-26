package FlexiSpot.SeatBookingEngine.scheduler;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.BookingRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class BookingStatusScheduler {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private SeatRepo seatRepo;

    // ⏰ Runs every 5 minutes
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void expirePastBookings() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Fetch expired bookings with joined Seat to prevent LazyInitializationException
        List<Booking> expiredBookings = bookingRepo.findExpiredBookingsWithSeat(today, now, BookingStatus.ACTIVE);

        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepo.save(booking);

            Seat seat = booking.getSeat();

            // Check for any remaining future ACTIVE bookings for the same seat
            boolean hasFutureBookings = bookingRepo
                    .findBySeatIdAndDateAndStatus(seat.getId(), today, BookingStatus.ACTIVE)
                    .stream()
                    .anyMatch(b -> b.getEndTime().isAfter(now));

            if (!hasFutureBookings) {
                seat.setIsAvailable(true);
                seatRepo.save(seat);
            }
        }

        System.out.println("Scheduler ran at " + now + " and expired " + expiredBookings.size() + " bookings.");
    }
}
