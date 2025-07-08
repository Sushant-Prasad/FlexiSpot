package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "meeting_bookings")
public class MeetingBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "User name is required")
    private String userName;

    @NotNull(message = "Meeting room is required")
    @ManyToOne
    @JoinColumn(name = "meeting_room_id")
    private MeetingRoom room;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate date;

    @NotBlank(message = "Time slot is required")
    private String timeSlot; // Example: "10:00-11:00"

    //No-arg constructor
    public MeetingBooking() {}

    //All-args constructor
    public MeetingBooking(Long id, String userName, MeetingRoom room, LocalDate date, String timeSlot) {
        this.id = id;
        this.userName = userName;
        this.room = room;
        this.date = date;
        this.timeSlot = timeSlot;
    }

    //Getters and Setters
    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public MeetingRoom getRoom() {
        return room;
    }

    public void setRoom(MeetingRoom room) {
        this.room = room;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }
}

