package FlexiSpot.SeatBookingEngine.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MeetingRoomDTO {

    private Long id;

    @NotBlank(message = "Room code is required")
    private String roomCode;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Building is required")
    private String building;

    @NotBlank(message = "Floor is required")
    private String floor;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    // === Constructors ===

    public MeetingRoomDTO() {
    }

    public MeetingRoomDTO(Long id, String roomCode, String location, String building, String floor, Boolean isAvailable) {
        this.id = id;
        this.roomCode = roomCode;
        this.location = location;
        this.building = building;
        this.floor = floor;
        this.isAvailable = isAvailable;
    }

    // === Getters and Setters ===

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

