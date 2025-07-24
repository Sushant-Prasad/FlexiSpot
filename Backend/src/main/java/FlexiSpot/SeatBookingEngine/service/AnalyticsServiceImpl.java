package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;

import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.model.User;

import FlexiSpot.SeatBookingEngine.repository.BookingRepository;
import FlexiSpot.SeatBookingEngine.repository.MeetingBookingRepo;

import FlexiSpot.SeatBookingEngine.repository.UserRepo;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private final BookingRepository bookingRepo;
    private final MeetingBookingRepo meetingBookingRepo;
    private final SeatRepo seatRepo;
    private final MeetingRoomRepo meetingRoomRepo;
    private final UserRepo userRepo;

    public AnalyticsServiceImpl(BookingRepository bookingRepo, MeetingBookingRepo meetingBookingRepo,
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
        Map<Integer, Integer> hourCounts = new HashMap<>();

        // Process desk bookings
        for (Booking b : bookingRepo.findByDate(date)) {
            int startHour = b.getStartTime().getHour();
            int endHour = b.getEndTime().getHour();
            for (int h = startHour; h < endHour; h++) {
                hourCounts.put(h, hourCounts.getOrDefault(h, 0) + 1);
            }
        }

        // Process meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDate(date)) {
            int startHour = m.getStartTime().getHour();
            int endHour = m.getEndTime().getHour();
            for (int h = startHour; h < endHour; h++) {
                hourCounts.put(h, hourCounts.getOrDefault(h, 0) + 1);
            }
        }

        int max = hourCounts.values().stream().max(Integer::compare).orElse(0);
        List<String> peakHours = hourCounts.entrySet().stream()
                .filter(e -> e.getValue() == max)
                .map(e -> String.format("%02d:00", e.getKey()))
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("peakHours", peakHours);
        result.put("maxBookings", max);
        return result;
    }

    @Override
    public Map<String, Integer> getTopUsed(LocalDate date) {
        Map<String, Integer> usage = new HashMap<>();

        // Process seat bookings
        for (Booking b : bookingRepo.findByDate(date)) {
            String seatLabel = "Seat: " + b.getSeat().getCode();
            usage.put(seatLabel, usage.getOrDefault(seatLabel, 0) + 1);
        }

        // Process meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDate(date)) {
            String roomLabel = "Room: " + m.getRoom().getRoomCode();
            usage.put(roomLabel, usage.getOrDefault(roomLabel, 0) + 1);
        }

        return usage;
    }

    @Override
    public Map<String, Object> getDailySummary(LocalDate date) {
        double occupancyRate = getOccupancyRate(date);
        Map<String, Object> peakData = getPeakHours(date);
        Map<String, Integer> topUsed = getTopUsed(date);

        Map<String, Object> summary = new HashMap<>();
        summary.put("date", date);
        summary.put("occupancyRate", String.format("%.2f%%", occupancyRate));
        summary.put("peakHours", peakData.get("peakHours"));
        summary.put("topUsed", topUsed);
        return summary;
    }

    @Override
    public Map<String, Object> getUserBookingPatterns(LocalDate date) {
        Map<String, Integer> userBookings = new HashMap<>();

        // Process seat bookings
        for (Booking b : bookingRepo.findByDate(date)) {
            String user = b.getUser().getName();
            userBookings.put(user, userBookings.getOrDefault(user, 0) + 1);
        }

        // Process meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDate(date)) {
            String user = m.getUser().getName();
            userBookings.put(user, userBookings.getOrDefault(user, 0) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("userBookings", userBookings);
        return result;
    }

    @Override
    public Map<String, Object> getFloorwiseOccupancy(LocalDate date) {
        List<Seat> seats = seatRepo.findAll();
        List<MeetingRoom> rooms = meetingRoomRepo.findAll();
        List<Booking> seatBookings = bookingRepo.findByDate(date);
        List<MeetingBooking> meetingBookings = meetingBookingRepo.findByDate(date);

        // Count total seats per floor
        Map<String, Long> seatFloorCount = seats.stream().collect(
                Collectors.groupingBy(Seat::getFloor, Collectors.counting()));

        // Count occupied seats per floor
        Map<String, Long> seatFloorOccupied = new HashMap<>();
        for (Booking b : seatBookings) {
            String floor = b.getSeat().getFloor();
            seatFloorOccupied.put(floor, seatFloorOccupied.getOrDefault(floor, 0L) + 1);
        }

        // Count total meeting rooms per floor
        Map<String, Long> roomFloorCount = rooms.stream().collect(
                Collectors.groupingBy(MeetingRoom::getFloor, Collectors.counting()));

        // Count occupied meeting rooms per floor
        Map<String, Long> roomFloorOccupied = new HashMap<>();
        for (MeetingBooking m : meetingBookings) {
            String floor = m.getRoom().getFloor();
            roomFloorOccupied.put(floor, roomFloorOccupied.getOrDefault(floor, 0L) + 1);
        }

        // Combine all floors
        Set<String> allFloors = new HashSet<>();
        allFloors.addAll(seatFloorCount.keySet());
        allFloors.addAll(roomFloorCount.keySet());

        Map<String, String> floorOccupancy = new HashMap<>();
        for (String floor : allFloors) {
            long totalResources = seatFloorCount.getOrDefault(floor, 0L) + roomFloorCount.getOrDefault(floor, 0L);
            long usedResources = seatFloorOccupied.getOrDefault(floor, 0L) + roomFloorOccupied.getOrDefault(floor, 0L);
            String percentage = totalResources == 0 ? "0.00%" :
                    String.format("%.2f%%", (usedResources * 100.0) / totalResources);
            floorOccupancy.put(floor, percentage);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("floorOccupancy", floorOccupancy);
        return result;
    }

    @Override
    public Map<String, Object> getWeeklySummary(String userIdOrName, LocalDate weekStart) {
        Map<String, Integer> summary = new LinkedHashMap<>();
        LocalDate start = weekStart;
        LocalDate end = weekStart.plusDays(6);

        User user = null;
        // Try to parse as Long (user id), else match by user name
        try {
            long id = Long.parseLong(userIdOrName);
            user = userRepo.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            List<User> candidates = userRepo.findAll().stream()
                    .filter(u -> u.getName().equalsIgnoreCase(userIdOrName))
                    .toList();
            if (!candidates.isEmpty()) user = candidates.get(0);
        }

        if (user == null) {
            return Map.of("user", userIdOrName, "summary", Collections.emptyMap());
        }

        // Initialize daily counts
        for (int i = 0; i < 7; i++) {
            LocalDate day = start.plusDays(i);
            summary.put(day.toString(), 0);
        }

        // Count seat bookings
        for (Booking b : bookingRepo.findByDateBetween(start, end)) {
            if (b.getUser().getId().equals(user.getId())) {
                String dateKey = b.getDate().toString();
                summary.put(dateKey, summary.get(dateKey) + 1);
            }
        }

        // Count meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDateBetween(start, end)) {
            if (m.getUser().getId().equals(user.getId())) {
                String dateKey = m.getDate().toString();
                summary.put(dateKey, summary.get(dateKey) + 1);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("user", user.getName());
        result.put("summary", summary);
        return result;
    }

    @Override
    public void exportSummaryCSV(LocalDate date, HttpServletResponse response) throws IOException {
        List<Booking> bookings = bookingRepo.findByDate(date);
        List<MeetingBooking> meetings = meetingBookingRepo.findByDate(date);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=usage-summary-" + date + ".csv");

        PrintWriter writer = response.getWriter();
        writer.println("Date,User,Resource,Type,Start Time,End Time");

        // Export seat bookings
        for (Booking b : bookings) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    date,
                    b.getUser().getName(),
                    b.getSeat().getCode(),
                    "Seat",
                    b.getStartTime(),
                    b.getEndTime());
        }

        // Export meeting room bookings
        for (MeetingBooking m : meetings) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    date,
                    m.getUser().getName(),
                    m.getRoom().getRoomCode(),
                    "MeetingRoom",
                    m.getStartTime(),
                    m.getEndTime());
        }

        writer.flush();
        writer.close();
    }

    @Override
    public Map<String, Object> getHeatmapData(LocalDate date) {
        Map<String, Map<String, Integer>> resourceHourHeatmap = new HashMap<>();

        // Process seat bookings
        for (Booking b : bookingRepo.findByDate(date)) {
            String code = b.getSeat().getCode();
            Map<String, Integer> hourMap = resourceHourHeatmap.computeIfAbsent(code, k -> new HashMap<>());
            for (int h = b.getStartTime().getHour(); h < b.getEndTime().getHour(); h++) {
                String hourLabel = String.format("%02d:00", h);
                hourMap.put(hourLabel, hourMap.getOrDefault(hourLabel, 0) + 1);
            }
        }

        // Process meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDate(date)) {
            String code = m.getRoom().getRoomCode();
            Map<String, Integer> hourMap = resourceHourHeatmap.computeIfAbsent(code, k -> new HashMap<>());
            for (int h = m.getStartTime().getHour(); h < m.getEndTime().getHour(); h++) {
                String hourLabel = String.format("%02d:00", h);
                hourMap.put(hourLabel, hourMap.getOrDefault(hourLabel, 0) + 1);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("date", date);
        result.put("heatmap", resourceHourHeatmap);
        return result;
    }

    @Override
    public Map<String, Object> getMonthlyUsageHeatmap(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<Booking> bookings = bookingRepo.findByDateBetween(start, end);
        List<MeetingBooking> meetings = meetingBookingRepo.findByDateBetween(start, end);

        Map<String, Integer> dailyHeatmap = new LinkedHashMap<>();

        // Initialize all days with 0
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            dailyHeatmap.put(d.toString(), 0);
        }

        // Count seat bookings per day
        for (Booking b : bookings) {
            String dateString = b.getDate().toString();
            dailyHeatmap.put(dateString, dailyHeatmap.get(dateString) + 1);
        }

        // Count meeting room bookings per day
        for (MeetingBooking m : meetings) {
            String dateString = m.getDate().toString();
            dailyHeatmap.put(dateString, dailyHeatmap.get(dateString) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("month", month.toString());
        result.put("heatmap", dailyHeatmap);
        return result;
    }

    @Override
    public Map<String, Object> getInactiveUsers(LocalDate sinceDate) {
        Set<Long> activeUserIds = new HashSet<>();

        // Get active users from seat bookings
        for (Booking b : bookingRepo.findByDateBetween(sinceDate, LocalDate.now())) {
            activeUserIds.add(b.getUser().getId());
        }

        // Get active users from meeting room bookings
        for (MeetingBooking m : meetingBookingRepo.findByDateBetween(sinceDate, LocalDate.now())) {
            activeUserIds.add(m.getUser().getId());
        }

        List<User> allUsers = userRepo.findAll();
        List<String> inactiveUserNames = allUsers.stream()
                .filter(u -> !activeUserIds.contains(u.getId()))
                .map(User::getName)
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("inactiveSince", sinceDate.toString());
        result.put("inactiveUsers", inactiveUserNames);
        return result;
    }

    @Override
    public Map<String, Object> getMostBooked(int topN) {
        LocalDate monthAgo = LocalDate.now().minusDays(30);
        List<Booking> bookings = bookingRepo.findByDateBetween(monthAgo, LocalDate.now());
        List<MeetingBooking> meetings = meetingBookingRepo.findByDateBetween(monthAgo, LocalDate.now());

        Map<String, Integer> resourceCountMap = new HashMap<>();

        // Count seat bookings
        for (Booking b : bookings) {
            String seatCode = b.getSeat().getCode();
            resourceCountMap.put(seatCode, resourceCountMap.getOrDefault(seatCode, 0) + 1);
        }

        // Count meeting room bookings
        for (MeetingBooking m : meetings) {
            String roomCode = m.getRoom().getRoomCode();
            resourceCountMap.put(roomCode, resourceCountMap.getOrDefault(roomCode, 0) + 1);
        }

        List<Map<String, Object>> topResources = resourceCountMap.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(topN)
                .map(e -> {
                    Map<String, Object> resourceMap = new HashMap<>();
                    resourceMap.put("resource", e.getKey());
                    resourceMap.put("bookings", e.getValue());
                    return resourceMap;
                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("top", topN);
        result.put("since", monthAgo.toString());
        result.put("mostBooked", topResources);
        return result;
    }

    @Override
    public Map<String, Object> suggestBestDays() {
        LocalDate monthAgo = LocalDate.now().minusDays(30);
        List<Booking> bookings = bookingRepo.findByDateBetween(monthAgo, LocalDate.now());
        List<MeetingBooking> meetings = meetingBookingRepo.findByDateBetween(monthAgo, LocalDate.now());

        Map<DayOfWeek, Integer> weekdayCounts = new EnumMap<>(DayOfWeek.class);

        // Count seat bookings by day of week
        for (Booking b : bookings) {
            DayOfWeek dayOfWeek = b.getDate().getDayOfWeek();
            weekdayCounts.put(dayOfWeek, weekdayCounts.getOrDefault(dayOfWeek, 0) + 1);
        }

        // Count meeting room bookings by day of week
        for (MeetingBooking m : meetings) {
            DayOfWeek dayOfWeek = m.getDate().getDayOfWeek();
            weekdayCounts.put(dayOfWeek, weekdayCounts.getOrDefault(dayOfWeek, 0) + 1);
        }

        // Sort by least booked (ascending order)
        List<String> bestDays = weekdayCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(3)
                .map(entry -> entry.getKey().toString())
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("suggestedDays", bestDays);
        result.put("basedOn", "Last 30 days");
        return result;
    }

    @Override
    public List<Object> getSeatBookingsForDate(LocalDate date) {
        return List.of();
    }


    // Additional method to get bookings for a specific date (if needed by interface)
    public List<Booking> getBookingsForDate(LocalDate date) {
        return bookingRepo.findByDate(date);
    }

    // Additional method to get meeting bookings for a specific date (if needed)
    public List<Object> getMeetingBookingsForDate(LocalDate date) {
        return Collections.singletonList(meetingBookingRepo.findByDate(date));
    }

    // for mail sending 
    @Override
    public Map<String, List<?>> getAllBookingsForDate(LocalDate date) {
        Map<String, List<?>> bookingsMap = new HashMap<>();
        bookingsMap.put("seatBookings", bookingRepo.findByDate(date));
        bookingsMap.put("meetingBookings", meetingBookingRepo.findByDate(date));
        return bookingsMap;
    }

    @Override
    public Map<String, Object> getDayBreakdown(LocalDate date) {
        return Map.of();
    }

}


