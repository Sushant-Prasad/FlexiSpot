package FlexiSpot.SeatBookingEngine.service;

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

    /**
     * Calculate overall occupancy rate for a specific date.
     * Includes both desk and meeting room occupancy.
     *
     * @param date the date to calculate occupancy for
     * @return occupancy rate as a percentage (0.0 to 100.0)
     */
    double getOccupancyRate(LocalDate date);

    /**
     * Get peak usage hours across all bookings (desk + meeting rooms).
     *
     * @param date the date to analyze
     * @return Map containing hourly usage statistics
     */
    Map<String, Object> getPeakHours(LocalDate date);

    /**
     * Get top-used seats and meeting rooms by booking count.
     *
     * @param date the date to analyze
     * @return Map containing ranked usage data
     */
    Map<String, Integer> getTopUsed(LocalDate date);

    /**
     * Get comprehensive daily summary including occupancy, peaks, and leaderboards.
     *
     * @param date the date to summarize
     * @return Map containing complete daily analytics
     */
    Map<String, Object> getDailySummary(LocalDate date);

    /**
     * Get user-wise booking patterns and statistics.
     *
     * @param date the date to analyze
     * @return Map containing user booking patterns
     */
    Map<String, Object> getUserBookingPatterns(LocalDate date);

    /**
     * Get occupancy percentage per floor for both seats and meeting rooms.
     *
     * @param date the date to analyze
     * @return Map containing floor-wise occupancy data
     */
    Map<String, Object> getFloorwiseOccupancy(LocalDate date);

    /**
     * Get user's weekly summary for calendar widgets and trend analysis.
     *
     * @param userNameOrId the user identifier (name or ID)
     * @param weekStart the start date of the week
     * @return Map containing weekly summary data
     */
    Map<String, Object> getWeeklySummary(String userNameOrId, LocalDate weekStart);

    /**
     * Export CSV with all bookings for a date (seats + meeting rooms).
     *
     * @param date the date to export
     * @param response HTTP response to write CSV to
     * @throws IOException if there's an error writing the CSV
     */
    void exportSummaryCSV(LocalDate date, HttpServletResponse response) throws IOException;

    /**
     * Get heatmap data with per-hour, per-seat/room booking structure.
     *
     * @param date the date to generate heatmap for
     * @return Map containing detailed heatmap data structure
     */
    Map<String, Object> getHeatmapData(LocalDate date);

    /**
     * Get monthly usage trend showing bookings per day for a month.
     * Includes both seat and meeting room bookings.
     *
     * @param month the year-month to analyze
     * @return Map containing daily booking counts for the month
     */
    Map<String, Object> getMonthlyUsageHeatmap(YearMonth month);

    /**
     * Get users who haven't booked any seat or room since the given date.
     *
     * @param sinceDate the date to check inactivity from
     * @return Map containing inactive user information
     */
    Map<String, Object> getInactiveUsers(LocalDate sinceDate);

    /**
     * Get the top N desks/rooms that were booked the most in the last 30 days.
     *
     * @param topN number of top bookings to return
     * @return Map containing most booked resources
     */
    Map<String, Object> getMostBooked(int topN);

    /**
     * Suggest the least crowded weekdays based on bookings in the last 30 days.
     * Analyzes patterns to recommend optimal working days.
     *
     * @return Map containing suggested best days for booking
     */
    Map<String, Object> suggestBestDays();

    /**
     * Get all seat bookings for a specific date.
     * Used for CSV exports, calendar integration, etc.
     *
     * @param date the date to retrieve bookings for
     * @return List of seat booking objects
     */
    List<Object> getSeatBookingsForDate(LocalDate date);

    /**
     * Get all meeting room bookings for a specific date.
     *
     * @param date the date to retrieve bookings for
     * @return List of meeting room booking objects
     */
    List<Object> getMeetingBookingsForDate(LocalDate date);

    /**
     * Get combined bookings (both seats and meeting rooms) for a specific date.
     * Useful for unified reporting and analytics.
     *
     * @param date the date to retrieve bookings for
     * @return Map containing both seat and meeting room bookings
     */
//    Map<String, List<Object>> getAllBookingsForDate(LocalDate date);

    /**
     * Get combined bookings (both seats and meeting rooms) for a specific date.
     * Useful for unified reporting and analytics.
     *
     * @param date the date to retrieve bookings for
     * @return Map containing both seat and meeting room bookings
     */
    Map<String, List<?>> getAllBookingsForDate(LocalDate date);

    Map<String, Object> getDayBreakdown(LocalDate date);


}
