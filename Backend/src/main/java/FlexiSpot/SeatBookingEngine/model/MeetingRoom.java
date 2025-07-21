package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;

@Entity
@Table(name = "meeting_rooms")
public class MeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomCode;
    private String location;
    private String building;
    private String floor;
    private Boolean isAvailable;

    // No-arg constructor
    public MeetingRoom() {}

    // All-args constructor
    public MeetingRoom(Long id, String roomCode, String location, String building, String floor, Boolean isAvailable) {
        this.id = id;
        this.roomCode = roomCode;
        this.location = location;
        this.building = building;
        this.floor = floor;
        this.isAvailable = isAvailable;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

}
