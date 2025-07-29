package FlexiSpot.SeatBookingEngine.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SeatDTO {

    private Long id;

    @NotBlank(message = "Seat code is required")
    private String code;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Building is required")
    private String building;

    @NotBlank(message = "Floor is required")
    private String floor;

    @NotBlank(message = "Segment is required")
    private String segment;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    // === Constructors ===

    public SeatDTO() {
    }

    public SeatDTO(Long id, String code, String location, String building, String floor,
                   String segment, Boolean isAvailable) {
        this.id = id;
        this.code = code;
        this.location = location;
        this.building = building;
        this.floor = floor;
        this.segment = segment;
        this.isAvailable = isAvailable;
    }

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public String getSegment() {
        return segment;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
