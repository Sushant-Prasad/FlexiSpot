package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.SeatDTO;
import java.util.List;

public interface SeatManagementService {

    // Create
    SeatDTO createSeat(SeatDTO seatDTO);

    // Read
    List<SeatDTO> getAllSeats();
    SeatDTO getSeatById(Long id);
    List<SeatDTO> getAvailableSeats();
    List<SeatDTO> getSeatsByFilters(String location, String building, String floor, String segment);

    // Update
    SeatDTO updateSeat(Long id, SeatDTO seatDTO);
    SeatDTO updateSeatAvailability(Long id, Boolean isAvailable);

    // Delete
    void deleteSeat(Long id);

    // Bulk operations
    List<SeatDTO> createMultipleSeats(List<SeatDTO> seatDTOs);
    void deleteMultipleSeats(List<Long> ids);
}

