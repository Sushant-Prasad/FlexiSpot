package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetingBookingService {

    @Autowired
    private MeetingBookingRepo bookingRepo;

    @Autowired
    private MeetingRoomRepo roomRepo;

    //Book a meeting room
    public MeetingBooking bookRoom(MeetingBooking booking) {
        Long roomId = booking.getRoom().getId();

        // Check if already booked for that slot
        boolean alreadyBooked = !bookingRepo.findByRoomIdAndDateAndTimeSlot(
                roomId, booking.getDate(), booking.getTimeSlot()).isEmpty();

        if (alreadyBooked) {
            throw new RuntimeException("Room already booked for this time slot.");
        }

        //Proceed to book
        return bookingRepo.save(booking);
    }

    //Cancel a booking
    public void cancelBooking(Long bookingId) {
        MeetingBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepo.delete(booking);
    }

    //View all bookings
    public List<MeetingBooking> getAllBookings() {
        return bookingRepo.findAll();
    }
}

