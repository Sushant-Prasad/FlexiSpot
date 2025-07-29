package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

/**
 * Analytics service interface for FlexiSpot usage analytics.
 * Provides comprehensive analytics for both desk bookings and meeting room bookings.
 */
public interface AnalyticsService {

    double getOccupancyRate(LocalDate date);

    Map<String, Object> getPeakHours(LocalDate date);

    Map<String, Integer> getTopUsed(LocalDate date);

    Map<String, Object> getDailySummary(LocalDate date);

    Map<String, Object> getUserBookingPatterns(LocalDate date);

    Map<String, Object> getFloorwiseOccupancy(LocalDate date);

    Map<String, Object> getWeeklySummary(String userNameOrId, LocalDate weekStart);

    void exportSummaryCSV(LocalDate date, HttpServletResponse response) throws IOException;

    Map<String, Object> getHeatmapData(LocalDate date);

    Map<String, Object> getMonthlyUsageHeatmap(YearMonth month);

    Map<String, Object> getInactiveUsers(LocalDate sinceDate);

    Map<String, Object> getMostBooked(int topN);

    Map<String, Object> suggestBestDays();

    List<Booking> getSeatBookingsForDate(LocalDate date);

    List<MeetingBooking> getMeetingBookingsForDate(LocalDate date);

    Map<String, List<?>> getAllBookingsForDate(LocalDate date);

    Map<String, Object> getDayBreakdown(LocalDate date);
}
