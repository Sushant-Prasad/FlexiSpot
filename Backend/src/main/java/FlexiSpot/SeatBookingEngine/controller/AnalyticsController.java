package FlexiSpot.SeatBookingEngine.controller;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import FlexiSpot.SeatBookingEngine.service.AnalyticsService;

import jakarta.servlet.http.HttpServletResponse;
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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final SeatRepo seatRepo;
    private final MeetingRoomRepo meetingRoomRepo;

    public AnalyticsController(AnalyticsService analyticsService, SeatRepo seatRepo,
                               MeetingRoomRepo meetingRoomRepo) {
        this.analyticsService = analyticsService;
        this.seatRepo = seatRepo;
        this.meetingRoomRepo = meetingRoomRepo;
    }

    @GetMapping("/monthly-usage-heatmap")
    public Map<String, Object> getMonthlyUsageHeatmap(
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return analyticsService.getMonthlyUsageHeatmap(month);
    }

    @GetMapping("/occupancy-rate")
    public Map<String, Object> getOccupancyRate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double occupancy = analyticsService.getOccupancyRate(date);
        Map<String, Object> response = new HashMap<>();
        response.put("date", date);
        response.put("occupancyRate", String.format("%.2f", occupancy) + "%");
        return response;
    }

    @GetMapping("/peak-hours")
    public Map<String, Object> getPeakHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getPeakHours(date);
    }

    @GetMapping("/top-used")
    public Map<String, Integer> getTopUsed(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return analyticsService.getTopUsed(date);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/daily-summary")
    public Map<String, Object> getDailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getDailySummary(date);
    }

    @GetMapping("/user-booking-patterns")
    public Map<String, Object> getUserBookingPatterns(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getUserBookingPatterns(date);
    }

    @GetMapping("/floorwise-occupancy")
    public Map<String, Object> getFloorwiseOccupancy(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getFloorwiseOccupancy(date);
    }

    @GetMapping("/weekly-summary")
    public Map<String, Object> getWeeklySummary(
            @RequestParam String user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return analyticsService.getWeeklySummary(user, startDate);
    }

    @GetMapping("/export-summary-csv")
    public void exportSummaryCSV(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            HttpServletResponse response) throws IOException {
        analyticsService.exportSummaryCSV(date, response);
    }

    @GetMapping("/day-breakdown")
    public Map<String, Object> getDayBreakdown(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return analyticsService.getDayBreakdown(date);
    }

    @GetMapping("/user-inactive")
    public Map<String, Object> getInactiveUsers(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate since) {
        return analyticsService.getInactiveUsers(since);
    }

    @GetMapping("/most-booked")
    public Map<String, Object> getMostBooked(@RequestParam(defaultValue = "5") int top) {
        return analyticsService.getMostBooked(top);
    }

    @GetMapping("/suggestions/best-days")
    public Map<String, Object> suggestBestDays() {
        return analyticsService.suggestBestDays();
    }

    @GetMapping("/test-auth")
    public Map<String, Object> testAuth() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Authentication successful!");
        response.put("timestamp", new Date());
        return response;
    }

    @GetMapping("/total-resources")
    public Map<String, Long> getTotalResources() {
        Map<String, Long> response = new HashMap<>();
        response.put("totalSeats", seatRepo.count());
        response.put("totalMeetingRooms", meetingRoomRepo.count());
        return response;
    }

    // Removed EmailService logic and replaced with CSV download support only
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

            // Instead of emailing, just return success and log CSV byte size
            System.out.println("CSV generated, size = " + csvBytes.length + " bytes");

            return ResponseEntity.ok("Report generated successfully (email not sent - feature disabled)");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Failed to generate report: " + ex.getMessage());
        }
    }
}
