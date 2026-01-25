package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.SeatDTO;
import FlexiSpot.SeatBookingEngine.mapper.SeatMapper;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SeatManagementServiceImpl implements SeatManagementService {

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private SeatMapper seatMapper;

    // ========================
    // CREATE
    // ========================
    @Override
    public SeatDTO createSeat(SeatDTO seatDTO) {

        if (seatRepo.findByCode(seatDTO.getCode()).isPresent()) {
            throw new RuntimeException("Seat with code " + seatDTO.getCode() + " already exists");
        }

        Seat seat = seatMapper.toEntity(seatDTO);
        Seat savedSeat = seatRepo.save(seat);

        return seatMapper.toDTO(savedSeat);
    }

    // ========================
    // READ
    // ========================
    @Override
    public List<SeatDTO> getAllSeats() {
        return seatMapper.toDTOList(seatRepo.findAll());
    }

    @Override
    public SeatDTO getSeatById(Long id) {
        Seat seat = seatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));

        return seatMapper.toDTO(seat);
    }

    @Override
    public List<SeatDTO> getAvailableSeats() {
        return seatMapper.toDTOList(seatRepo.findByIsAvailableTrue());
    }

    @Override
    public List<SeatDTO> getSeatsByFilters(String location, String building, String floor, String segment) {
        return seatMapper.toDTOList(
                seatRepo.findSeatsByFilters(location, building, floor, segment)
        );
    }

    // ========================
    // UPDATE
    // ========================
    @Override
    public SeatDTO updateSeat(Long id, SeatDTO seatDTO) {

        Seat seat = seatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));

        // Check duplicate code (excluding same seat)
        if (!seat.getCode().equals(seatDTO.getCode()) &&
                seatRepo.findByCode(seatDTO.getCode()).isPresent()) {
            throw new RuntimeException("Seat with code " + seatDTO.getCode() + " already exists");
        }

        seat.setCode(seatDTO.getCode());
        seat.setLocation(seatDTO.getLocation());
        seat.setBuilding(seatDTO.getBuilding());
        seat.setFloor(seatDTO.getFloor());
        seat.setSegment(seatDTO.getSegment());
        seat.setIsAvailable(seatDTO.getIsAvailable());

        return seatMapper.toDTO(seatRepo.save(seat));
    }

    @Override
    public SeatDTO updateSeatAvailability(Long id, Boolean isAvailable) {

        Seat seat = seatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));

        seat.setIsAvailable(isAvailable);
        return seatMapper.toDTO(seatRepo.save(seat));
    }

    // ========================
    // DELETE
    // ========================
    @Override
    public void deleteSeat(Long id) {
        if (!seatRepo.existsById(id)) {
            throw new RuntimeException("Seat not found with id: " + id);
        }
        seatRepo.deleteById(id);
    }

    @Override
    public List<SeatDTO> createMultipleSeats(List<SeatDTO> seatDTOs) {
        List<Seat> seats = seatMapper.toEntityList(seatDTOs);
        return seatMapper.toDTOList(seatRepo.saveAll(seats));
    }

    @Override
    public void deleteMultipleSeats(List<Long> ids) {
        seatRepo.deleteAllById(ids);
    }
}
