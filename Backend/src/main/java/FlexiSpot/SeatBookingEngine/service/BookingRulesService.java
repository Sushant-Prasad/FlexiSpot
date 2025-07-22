package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.repository.BookingRulesRepository;
import FlexiSpot.SeatBookingEngine.rules.SeatBookingRules;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingRulesService {

    @Autowired
    private BookingRulesRepository bookingRepo;

    public void validateBooking(Booking booking) {
        List<Booking> allBookings = bookingRepo.findByDate(booking.getDate());
        SeatBookingRules.applyAllRules(booking, allBookings);
    }
}
