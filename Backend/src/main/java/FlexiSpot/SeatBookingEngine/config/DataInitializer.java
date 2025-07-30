package FlexiSpot.SeatBookingEngine.config;

import FlexiSpot.SeatBookingEngine.model.*;
import FlexiSpot.SeatBookingEngine.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private MeetingRoomRepo meetingRoomRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private MeetingBookingRepo meetingBookingRepo;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepo.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create sample users
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword("admin123");
        adminUser.setRole("ADMIN");
        adminUser.setName("Admin User");
        adminUser.setEmail("admin@flexispot.com");
        userRepo.save(adminUser);

        User employeeUser = new User();
        employeeUser.setUsername("employee");
        employeeUser.setPassword("employee123");
        employeeUser.setRole("EMPLOYEE");
        employeeUser.setName("Employee User");
        employeeUser.setEmail("employee@flexispot.com");
        userRepo.save(employeeUser);

        // Create sample seats
        Seat seat1 = new Seat();
        seat1.setCode("A1-101");
        seat1.setLocation("Delhi");
        seat1.setBuilding("A");
        seat1.setFloor("1st");
        seat1.setSegment("Alpha");
        seat1.setDeskId("DESK001");
        seat1.setAvailable(true);
        seatRepo.save(seat1);

        Seat seat2 = new Seat();
        seat2.setCode("A1-102");
        seat2.setLocation("Delhi");
        seat2.setBuilding("A");
        seat2.setFloor("1st");
        seat2.setSegment("Alpha");
        seat2.setDeskId("DESK002");
        seat2.setAvailable(true);
        seatRepo.save(seat2);

        Seat seat3 = new Seat();
        seat3.setCode("B2-201");
        seat3.setLocation("Mumbai");
        seat3.setBuilding("B");
        seat3.setFloor("2nd");
        seat3.setSegment("Beta");
        seat3.setDeskId("DESK003");
        seat3.setAvailable(true);
        seatRepo.save(seat3);

        // Create sample meeting rooms
        MeetingRoom room1 = new MeetingRoom();
        room1.setRoomCode("MR001");
        room1.setLocation("Delhi");
        room1.setBuilding("A");
        room1.setFloor("1st");
        room1.setAvailable(true);
        meetingRoomRepo.save(room1);

        MeetingRoom room2 = new MeetingRoom();
        room2.setRoomCode("MR002");
        room2.setLocation("Mumbai");
        room2.setBuilding("B");
        room2.setFloor("2nd");
        room2.setAvailable(true);
        meetingRoomRepo.save(room2);

        // Create sample bookings
        Booking booking1 = new Booking();
        booking1.setUser(employeeUser);
        booking1.setSeat(seat1);
        booking1.setDate(LocalDate.now().plusDays(1));
        booking1.setStartTime(LocalTime.of(9, 0));
        booking1.setEndTime(LocalTime.of(17, 0));
        booking1.setStatus(BookingStatus.ACTIVE);
        bookingRepo.save(booking1);

        // Create sample meeting bookings
        MeetingBooking meetingBooking1 = new MeetingBooking();
        meetingBooking1.setUser(employeeUser);
        meetingBooking1.setRoom(room1);
        meetingBooking1.setDate(LocalDate.now().plusDays(2));
        meetingBooking1.setStartTime(LocalTime.of(14, 0));
        meetingBooking1.setEndTime(LocalTime.of(16, 0));
        meetingBooking1.setStatus(BookingStatus.ACTIVE);
        meetingBookingRepo.save(meetingBooking1);

        System.out.println("Sample data initialized successfully!");
    }
} 