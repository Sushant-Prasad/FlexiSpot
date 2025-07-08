package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "User name is required")
    private String userName;

    @NotNull(message = "Seat is required")
    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate date;

    //No-arg constructor
    public Booking() {
    }

    //All-args constructor
    public Booking(Long id, String userName, Seat seat, LocalDate date) {
        this.id = id;
        this.userName = userName;
        this.seat = seat;
        this.date = date;
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

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
