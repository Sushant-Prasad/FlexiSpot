package FlexiSpot.SeatBookingEngine.rules;

import FlexiSpot.SeatBookingEngine.model.Booking;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class SeatBookingRules {

    public static void applyAllRules(Booking booking, List<Booking> existingBookings) {
        LocalDate date = booking.getDate();
        LocalTime start = booking.getStartTime();
        LocalTime end = booking.getEndTime();

        // Rule 1: No booking on weekends
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Bookings are not allowed on weekends.");
        }

        // Rule 2: Booking time must be between 9 AM to 6 PM
        if (start.isBefore(LocalTime.of(9, 0)) || end.isAfter(LocalTime.of(18, 0))) {
            throw new RuntimeException("Booking time must be between 9 AM to 6 PM.");
        }

        // Rule 3: Duration must be at least 15 minutes
        if (Duration.between(start, end).toMinutes() < 15) {
            throw new RuntimeException("Booking must be at least 15 minutes long.");
        }

        // Rule 4: Date must not be in past or more than 7 days in future
        LocalDate today = LocalDate.now();
        if (date.isBefore(today) || date.isAfter(today.plusDays(7))) {
            throw new RuntimeException("Booking date must be within 7 days from today.");
        }

        // Rule 5: Start time must be before end time
        if (!start.isBefore(end)) {
            throw new RuntimeException("Start time must be before end time.");
        }

        // Rule 6: Only one booking per user per day
        for (Booking existing : existingBookings) {
            if (existing.getUser().getEmail().equals(booking.getUser().getEmail())) && existing.getDate().equals(date)) {
                throw new RuntimeException("Only one booking per user per day is allowed.");
            }

            // Rule 7: No overlapping bookings for the same seat
            if (existing.getSeatNumber().equals(booking.getSeatNumber()) && existing.getDate().equals(date)) {
                boolean overlaps = !(end.isBefore(existing.getStartTime()) || start.isAfter(existing.getEndTime()));
                if (overlaps) {
                    throw new RuntimeException("Overlapping booking exists for this seat.");
                }
            }
            
            // Rule 8: Prevent same seat booked by the same user multiple times even if time doesnt overlap
            if (existing.getUser().getEmail().equals(booking.getUser().getEmail())) &&
                existing.getSeatNumber().equals(booking.getSeatNumber()) &&
                existing.getDate().equals(date)) {
                throw new RuntimeException("Cannot book the same seat multiple times on the same day.");
            }
        }
    }
}
