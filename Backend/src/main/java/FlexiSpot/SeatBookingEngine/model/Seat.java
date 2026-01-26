package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Seat code is required")
    @Column(unique = true, nullable = false)
    private String code;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @NotBlank(message = "Building is required")
    @Column(nullable = false)
    private String building;

    @NotBlank(message = "Floor is required")
    @Column(nullable = false)
    private String floor;

    @NotBlank(message = "Segment is required")
    @Column(nullable = false)
    private String segment;

    @NotNull
    @Column(nullable = false)
    private Boolean isAvailable;

    // ✅ No-args constructor (required by JPA)
    public Seat() {
    }

    // ✅ Constructor for CREATE (NO id here)
    public Seat(String code,
                String location,
                String building,
                String floor,
                String segment,
                Boolean isAvailable) {
        this.code = code;
        this.location = location;
        this.building = building;
        this.floor = floor;
        this.segment = segment;
        this.isAvailable = isAvailable;
    }

    // 🔹 Getters only (no setId)
    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getLocation() {
        return location;
    }

    public String getBuilding() {
        return building;
    }

    public String getFloor() {
        return floor;
    }

    public String getSegment() {
        return segment;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    // 🔹 Setters (NO setId)
    public void setCode(String code) {
        this.code = code;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public void setIsAvailable(Boolean available) {
        this.isAvailable = available;
    }
}
