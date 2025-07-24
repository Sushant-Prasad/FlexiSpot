package FlexiSpot.SeatBookingEngine.controller;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import FlexiSpot.SeatBookingEngine.service.AnalyticsService;
import FlexiSpot.SeatBookingEngine.service.EmailService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "http://localhost:5173")
//@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final SeatRepo seatRepo;
    private final MeetingRoomRepo meetingRoomRepo;
    private final EmailService emailService;

    public AnalyticsController(AnalyticsService analyticsService, SeatRepo seatRepo, MeetingRoomRepo meetingRoomRepo, EmailService emailService) {
        this.analyticsService = analyticsService;
        this.seatRepo = seatRepo;
        this.meetingRoomRepo = meetingRoomRepo;
        this.emailService = emailService;
    }

    // 1. Usage Heatmap (NEW - seat+meeting bookings per day)
    @GetMapping("/monthly-usage-heatmap")
    public Map<String, Object> getMonthlyUsageHeatmap(
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return analyticsService.getMonthlyUsageHeatmap(month);
    }

    // 2. Occupancy Rate (desks - extend this for meetings if needed)
    @GetMapping("/occupancy-rate")
    public Map<String, Object> getOccupancyRate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double occupancy = analyticsService.getOccupancyRate(date);
        Map<String, Object> response = new HashMap<>();
        response.put("date", date);
        response.put("occupancyRate", String.format("%.2f", occupancy) + "%");
        return response;
    }

    // 3. Peak Hours (aggregated by seat+meeting bookings)
    @GetMapping("/peak-hours")
    public Map<String, Object> getPeakHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getPeakHours(date);
    }

    // 4. Top Seats/Rooms Used (Unified leaderboard)
    @GetMapping("/top-used")
    public Map<String, Integer> getTopUsed(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getTopUsed(date);
    }

    // 5. Daily summary (all activity on a given day)
    @GetMapping("/daily-summary")
    public Map<String, Object> getDailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getDailySummary(date);
    }

    // 6. User booking patterns
    @GetMapping("/user-booking-patterns")
    public Map<String, Object> getUserBookingPatterns(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getUserBookingPatterns(date);
    }

    // 7. Floorwise occupancy (seat and meeting rooms)
    @GetMapping("/floorwise-occupancy")
    public Map<String, Object> getFloorwiseOccupancy(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getFloorwiseOccupancy(date);
    }

    // 8. Weekly summary for a user
    @GetMapping("/weekly-summary")
    public Map<String, Object> getWeeklySummary(
            @RequestParam String user, // user name or id
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return analyticsService.getWeeklySummary(user, startDate);
    }

    // 9. Export CSV (for a day, all bookings)
    @GetMapping("/export-summary-csv")
    public void exportSummaryCSV(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            HttpServletResponse response) throws IOException {
        analyticsService.exportSummaryCSV(date, response);
    }

    // 10. Per-day Breakdown (for drilldown into a date)
    @GetMapping("/day-breakdown")
    public Map<String, Object> getDayBreakdown(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getDayBreakdown(date);
    }

    // 11. User inactivity (users with no bookings since a date)
    @GetMapping("/user-inactive")
    public Map<String, Object> getInactiveUsers(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate since) {
        return analyticsService.getInactiveUsers(since);
    }

    // 12. Most booked seats/rooms, configurable top N
    @GetMapping("/most-booked")
    public Map<String, Object> getMostBooked(@RequestParam(defaultValue = "5") int top) {
        return analyticsService.getMostBooked(top);
    }

    // 13. Suggested best days (lowest activity in last month)
    @GetMapping("/suggestions/best-days")
    public Map<String, Object> suggestBestDays() {
        return analyticsService.suggestBestDays();
    }
    // New endpoint to get total resources
    @GetMapping("/total-resources")
    public Map<String, Long> getTotalResources() {
        Map<String, Long> response = new HashMap<>();
        response.put("totalSeats", seatRepo.count());
        response.put("totalMeetingRooms", meetingRoomRepo.count());
        return response;
    }


    // Email report endpoint

    @PostMapping("/send-report")
    public ResponseEntity<?> sendReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String email) {
        try {
            Map<String, List<?>> bookingsMap = analyticsService.getAllBookingsForDate(date);
            List<Booking> seatBookings = (List<Booking>) bookingsMap.getOrDefault("seatBookings", Collections.emptyList());
            List<MeetingBooking> meetingBookings = (List<MeetingBooking>) bookingsMap.getOrDefault("meetingBookings", Collections.emptyList());

            if (seatBookings.isEmpty() && meetingBookings.isEmpty()) {
                return ResponseEntity.status(400).body("No bookings found for " + date);
            }

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(bos);
            writer.println("Date,User,Resource,Type,Start Time,End Time");

            for (Booking booking : seatBookings) {
                writer.printf("%s,%s,%s,%s,%s,%s%n",
                        booking.getDate(),
                        booking.getUser() != null ? booking.getUser().getName() : "Unknown",
                        booking.getSeat() != null ? booking.getSeat().getCode() : "Unknown",
                        "Seat",
                        booking.getStartTime(),
                        booking.getEndTime());
            }

            for (MeetingBooking meeting : meetingBookings) {
                writer.printf("%s,%s,%s,%s,%s,%s%n",
                        meeting.getDate(),
                        meeting.getUser() != null ? meeting.getUser().getName() : "Unknown",
                        meeting.getRoom() != null ? meeting.getRoom().getRoomCode() : "Unknown",
                        "MeetingRoom",
                        meeting.getStartTime(),
                        meeting.getEndTime());
            }

            writer.flush();
            byte[] csvBytes = bos.toByteArray();
            writer.close();

            String subject = "Workspace Usage Summary – " + date;
            String htmlBody =
                    "<p>Hello,</p>" +
                            "<p>Please find attached the workspace usage summary report for <b>" + date + "</b> in CSV format.</p>" +
                            "<p>If you have any questions regarding the data or require further assistance,<br>" +
                            "feel free to contact us.</p>" +
                            "<p>Best regards,<br>FlexiSpot Analytics Team</p>";

            emailService.sendCSVReport(email, subject, htmlBody, csvBytes, "usage-summary-" + date + ".csv");

            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send email: " + ex.getMessage());
        }
    }



}

