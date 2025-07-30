package FlexiSpot.SeatBookingEngine;

import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.model.User;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import FlexiSpot.SeatBookingEngine.repository.UserRepo;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private MeetingRoomRepo meetingRoomRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepo.count() == 0) {
            initializeUsers();
            initializeSeats();
            initializeMeetingRooms();
            System.out.println("✅ Sample data initialized successfully!");
        } else {
            System.out.println("ℹ️  Database already contains data, skipping initialization.");
        }
    }

    private void initializeUsers() {
        // Create Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@flexispot.com");
        admin.setPhoneNumber("1234567890");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("admin");
        admin.setEmpId(1001);
        userRepo.save(admin);

        // Create Employee User
        User employee = new User();
        employee.setName("Employee User");
        employee.setEmail("employee@flexispot.com");
        employee.setPhoneNumber("9876543210");
        employee.setPassword(passwordEncoder.encode("employee123"));
        employee.setRole("employee");
        employee.setEmpId(2001);
        userRepo.save(employee);

        System.out.println("👥 Sample users created:");
        System.out.println("   Admin: admin@flexispot.com / admin123");
        System.out.println("   Employee: employee@flexispot.com / employee123");
    }

    private void initializeSeats() {
        // Delhi Office Seats
        Seat seat1 = new Seat();
        seat1.setCode("A1-101");
        seat1.setLocation("Delhi");
        seat1.setBuilding("Building A");
        seat1.setFloor("1st Floor");
        seat1.setSegment("Alpha");
        seat1.setIsAvailable(true);
        seatRepo.save(seat1);

        Seat seat2 = new Seat();
        seat2.setCode("A1-102");
        seat2.setLocation("Delhi");
        seat2.setBuilding("Building A");
        seat2.setFloor("1st Floor");
        seat2.setSegment("Alpha");
        seat2.setIsAvailable(true);
        seatRepo.save(seat2);

        Seat seat3 = new Seat();
        seat3.setCode("A2-201");
        seat3.setLocation("Delhi");
        seat3.setBuilding("Building A");
        seat3.setFloor("2nd Floor");
        seat3.setSegment("Beta");
        seat3.setIsAvailable(true);
        seatRepo.save(seat3);

        // Mumbai Office Seats
        Seat seat4 = new Seat();
        seat4.setCode("B1-101");
        seat4.setLocation("Mumbai");
        seat4.setBuilding("Building B");
        seat4.setFloor("1st Floor");
        seat4.setSegment("Gamma");
        seat4.setIsAvailable(true);
        seatRepo.save(seat4);

        Seat seat5 = new Seat();
        seat5.setCode("B2-201");
        seat5.setLocation("Mumbai");
        seat5.setBuilding("Building B");
        seat5.setFloor("2nd Floor");
        seat5.setSegment("Delta");
        seat5.setIsAvailable(true);
        seatRepo.save(seat5);

        // Pune Office Seats
        Seat seat6 = new Seat();
        seat6.setCode("C1-101");
        seat6.setLocation("Pune");
        seat6.setBuilding("Building C");
        seat6.setFloor("1st Floor");
        seat6.setSegment("Epsilon");
        seat6.setIsAvailable(true);
        seatRepo.save(seat6);

        System.out.println("🪑 Sample seats created (6 seats across 3 locations)");
    }

    private void initializeMeetingRooms() {
        // Delhi Office Meeting Rooms
        MeetingRoom room1 = new MeetingRoom();
        room1.setRoomCode("MR001");
        room1.setLocation("Delhi");
        room1.setBuilding("Building A");
        room1.setFloor("1st Floor");
        room1.setCapacity(8);
        room1.setIsAvailable(true);
        meetingRoomRepo.save(room1);

        MeetingRoom room2 = new MeetingRoom();
        room2.setRoomCode("MR002");
        room2.setLocation("Delhi");
        room2.setBuilding("Building A");
        room2.setFloor("2nd Floor");
        room2.setCapacity(12);
        room2.setIsAvailable(true);
        meetingRoomRepo.save(room2);

        // Mumbai Office Meeting Rooms
        MeetingRoom room3 = new MeetingRoom();
        room3.setRoomCode("MR003");
        room3.setLocation("Mumbai");
        room3.setBuilding("Building B");
        room3.setFloor("1st Floor");
        room3.setCapacity(6);
        room3.setIsAvailable(true);
        meetingRoomRepo.save(room3);

        MeetingRoom room4 = new MeetingRoom();
        room4.setRoomCode("MR004");
        room4.setLocation("Mumbai");
        room4.setBuilding("Building B");
        room4.setFloor("2nd Floor");
        room4.setCapacity(10);
        room4.setIsAvailable(true);
        meetingRoomRepo.save(room4);

        // Pune Office Meeting Rooms
        MeetingRoom room5 = new MeetingRoom();
        room5.setRoomCode("MR005");
        room5.setLocation("Pune");
        room5.setBuilding("Building C");
        room5.setFloor("1st Floor");
        room5.setCapacity(4);
        room5.setIsAvailable(true);
        meetingRoomRepo.save(room5);

        System.out.println("🏢 Sample meeting rooms created (5 rooms across 3 locations)");
    }
} 