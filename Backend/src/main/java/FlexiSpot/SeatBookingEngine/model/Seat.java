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
    @Column(unique = true)
    private String code;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Building is required")
    private String building;

    @NotBlank(message = "Floor is required")
    private String floor; // like 1,2,3,ground floor,

    @NotBlank(message = "Segment is required")
    private String segment;

    @NotNull
    private Boolean isAvailable;

    //Constructors
    public Seat() {}
    //All-args constructor
    public Seat(Long id, String code, String location, String building, String floor, String segment, Boolean isAvailable) {
        this.id = id;
        this.code = code;
        this.location = location;
        this.building = building;
        this.floor = floor;
        this.segment = segment;
        this.isAvailable = isAvailable;
    }

    //Getters and Setters

    public Long getId() {
        return id;
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

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
