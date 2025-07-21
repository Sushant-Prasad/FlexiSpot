package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_events")
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "calendar_type", nullable = false)
    private String calendarType;

    @Column(name = "calendar_event_id", nullable = false)
    private String calendarEventId;

    @Column(name = "calendar_sync_status")
    private String calendarSyncStatus = "Pending";

    @Column(name = "reminder_time")
    private Integer reminderTime;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    // === Constructors ===
    public CalendarEvent() {}

    public CalendarEvent(Long eventId, Booking booking, String calendarType, String calendarEventId,
                         String calendarSyncStatus, Integer reminderTime, LocalDateTime timestamp) {
        this.eventId = eventId;
        this.booking = booking;
        this.calendarType = calendarType;
        this.calendarEventId = calendarEventId;
        this.calendarSyncStatus = calendarSyncStatus;
        this.reminderTime = reminderTime;
        this.timestamp = timestamp;
    }

    // === Getters and Setters ===
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getCalendarType() {
        return calendarType;
    }

    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    public String getCalendarEventId() {
        return calendarEventId;
    }

    public void setCalendarEventId(String calendarEventId) {
        this.calendarEventId = calendarEventId;
    }

    public String getCalendarSyncStatus() {
        return calendarSyncStatus;
    }

    public void setCalendarSyncStatus(String calendarSyncStatus) {
        this.calendarSyncStatus = calendarSyncStatus;
    }

    public Integer getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(Integer reminderTime) {
        this.reminderTime = reminderTime;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
