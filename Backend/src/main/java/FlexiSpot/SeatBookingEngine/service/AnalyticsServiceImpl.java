package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.*;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BookingRepo bookingRepo;
    private final MeetingBookingRepo meetingBookingRepo;
    private final SeatRepo seatRepo;
    private final MeetingRoomRepo meetingRoomRepo;
    private final UserRepo userRepo;

    public AnalyticsServiceImpl(BookingRepo bookingRepo, MeetingBookingRepo meetingBookingRepo,
                                SeatRepo seatRepo, MeetingRoomRepo meetingRoomRepo, UserRepo userRepo) {
        this.bookingRepo = bookingRepo;
        this.meetingBookingRepo = meetingBookingRepo;
        this.seatRepo = seatRepo;
        this.meetingRoomRepo = meetingRoomRepo;
        this.userRepo = userRepo;
    }

    @Override
    public double getOccupancyRate(LocalDate date) {
        long seatBookings = bookingRepo.findByDate(date).size();
        long meetingBookings = meetingBookingRepo.findByDate(date).size();
        long totalSeats = seatRepo.count();
        long totalRooms = meetingRoomRepo.count();
        long totalResources = totalSeats + totalRooms;
        if (totalResources == 0) return 0.0;
        return ((seatBookings + meetingBookings) * 100.0) / totalResources;
    }

    @Override
    public Map<String, Object> getPeakHours(LocalDate date) {
        Map<String, Object> map = new HashMap<>();
        map.put("peakHour", "10:00-11:00");
        map.put("usage", 42);
        return map;
    }

    @Override
    public Map<String, Integer> getTopUsed(LocalDate date) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getDailySummary(LocalDate date) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getUserBookingPatterns(LocalDate date) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getFloorwiseOccupancy(LocalDate date) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getWeeklySummary(String userNameOrId, LocalDate weekStart) {
        return new HashMap<>();
    }

    @Override
    public void exportSummaryCSV(LocalDate date, HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        PrintWriter writer = response.getWriter();
        writer.println("Type,Count");
        writer.println("Bookings," + bookingRepo.findByDate(date).size());
        writer.println("MeetingBookings," + meetingBookingRepo.findByDate(date).size());
        writer.flush();
    }

    @Override
    public Map<String, Object> getHeatmapData(LocalDate date) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getMonthlyUsageHeatmap(YearMonth month) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getInactiveUsers(LocalDate sinceDate) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> getMostBooked(int topN) {
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> suggestBestDays() {
        return new HashMap<>();
    }

    @Override
    public List<Booking> getSeatBookingsForDate(LocalDate date) {
        return bookingRepo.findByDate(date);
    }

    @Override
    public List<MeetingBooking> getMeetingBookingsForDate(LocalDate date) {
        return meetingBookingRepo.findByDate(date);
    }

    @Override
    public Map<String, List<?>> getAllBookingsForDate(LocalDate date) {
        Map<String, List<?>> map = new HashMap<>();
        map.put("seats", getSeatBookingsForDate(date));
        map.put("meetings", getMeetingBookingsForDate(date));
        return map;
    }

    @Override
    public Map<String, Object> getDayBreakdown(LocalDate date) {
        return new HashMap<>();
    }
}
