package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_availability")
public class SeatAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Link to Seat entity (many availability entries for one seat)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    // ✅ Whether the seat was available at this time
    private Boolean isAvailable;

    // ✅ When this availability snapshot was recorded
    private LocalDateTime timeSlot;

    // ✅ When the seat became available (null if not available)
    private LocalDateTime availableSince;

    // ✅ Duration (how long the seat has been booked or available)
    private Integer durationMinutes;

    // ====== Constructors ======
    public SeatAvailability() {}

    public SeatAvailability(Long id, Seat seat, Boolean isAvailable, LocalDateTime timeSlot,
                            LocalDateTime availableSince, Integer durationMinutes) {
        this.id = id;
        this.seat = seat;
        this.isAvailable = isAvailable;
        this.timeSlot = timeSlot;
        this.availableSince = availableSince;
        this.durationMinutes = durationMinutes;
    }

    // ====== Getters and Setters ======
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    public LocalDateTime getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(LocalDateTime timeSlot) {
        this.timeSlot = timeSlot;
    }

    public LocalDateTime getAvailableSince() {
        return availableSince;
    }

    public void setAvailableSince(LocalDateTime availableSince) {
        this.availableSince = availableSince;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}

