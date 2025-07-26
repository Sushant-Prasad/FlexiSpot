package FlexiSpot.SeatBookingEngine.DTO;

import FlexiSpot.SeatBookingEngine.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public class MeetingBookingDTO {

    private Long id;

    private Long userId;
    private String userName;

    private Long meetingRoomId;
    private String meetingRoomCode;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private BookingStatus status;

    // === Constructors ===
    public MeetingBookingDTO() {}

    public MeetingBookingDTO(Long id, Long userId, String userName,
                             Long meetingRoomId, String meetingRoomCode,
                             LocalDate date, LocalTime startTime,
                             LocalTime endTime, BookingStatus status) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.meetingRoomId = meetingRoomId;
        this.meetingRoomCode = meetingRoomCode;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    // === Getters and Setters ===
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getMeetingRoomId() {
        return meetingRoomId;
    }

    public void setMeetingRoomId(Long meetingRoomId) {
        this.meetingRoomId = meetingRoomId;
    }

    public String getMeetingRoomCode() {
        return meetingRoomCode;
    }

    public void setMeetingRoomCode(String meetingRoomCode) {
        this.meetingRoomCode = meetingRoomCode;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
