package FlexiSpot.SeatBookingEngine.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingDTO {
    private Long id;
    private Long userId;
    private Long seatId;

    private String userName;
    private String seatCode;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    // Constructors
    public BookingDTO() {}

    public BookingDTO(Long id, Long userId, String userName, Long seatId, String seatCode,
                      LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.seatId = seatId;
        this.seatCode = seatCode;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public Long getSeatId() {
        return seatId;
    }

    public String getSeatCode() {
        return seatCode;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public void setSeatCode(String seatCode) {
        this.seatCode = seatCode;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}

