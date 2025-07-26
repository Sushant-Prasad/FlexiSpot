package FlexiSpot.SeatBookingEngine.DTO;

import java.time.LocalTime;

public class TimeSlotStatus {

    private LocalTime startTime;
    private LocalTime endTime;
    private boolean isBooked;

    private Long bookingId;
    private String bookedBy;

    // Constructors
    public TimeSlotStatus() {}

    public TimeSlotStatus(LocalTime startTime, LocalTime endTime, boolean isBooked) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.isBooked = isBooked;
    }

    public TimeSlotStatus(LocalTime startTime, LocalTime endTime, boolean isBooked,
                          Long bookingId, String bookedBy) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.isBooked = isBooked;
        this.bookingId = bookingId;
        this.bookedBy = bookedBy;
    }

    // Getters and Setters
    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        isBooked = booked;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookedBy() {
        return bookedBy;
    }

    public void setBookedBy(String bookedBy) {
        this.bookedBy = bookedBy;
    }
}
