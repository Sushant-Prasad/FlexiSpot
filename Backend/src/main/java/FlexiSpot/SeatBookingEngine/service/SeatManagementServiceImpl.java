package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.SeatDTO;
import FlexiSpot.SeatBookingEngine.mapper.SeatMapper;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.repository.SeatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SeatManagementServiceImpl implements SeatManagementService {

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private SeatMapper seatMapper;

    @Override
    public SeatDTO createSeat(SeatDTO seatDTO) {
        if (seatRepo.findByCode(seatDTO.getCode()).isPresent()) {
            throw new RuntimeException("Seat with code " + seatDTO.getCode() + " already exists");
        }

        // Only check for existing ID if the seatDTO has an ID (for updates)
        if (seatDTO.getId() != null && seatRepo.findById(seatDTO.getId()).isPresent()) {
            throw new RuntimeException("Seat with desk ID " + seatDTO.getId() + " already exists");
        }

        Seat seat = seatMapper.toEntity(seatDTO);
        Seat savedSeat = seatRepo.save(seat);
        return seatMapper.toDTO(savedSeat);
    }

    @Override
    public List<SeatDTO> getAllSeats() {
        return seatMapper.toDTOList(seatRepo.findAll());
    }

    @Override
    public SeatDTO getSeatById(Long id) {
        return seatRepo.findById(id)
                .map(seatMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));
    }

    @Override
    public List<SeatDTO> getAvailableSeats() {
        return seatMapper.toDTOList(seatRepo.findByIsAvailableTrue());
    }

    @Override
    public List<SeatDTO> getSeatsByFilters(String location, String building, String floor, String segment) {
        return seatMapper.toDTOList(seatRepo.findSeatsByFilters(location, building, floor, segment));
    }

    @Override
    public SeatDTO updateSeat(Long id, SeatDTO seatDTO) {
        Seat seat = seatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));

        if (!seat.getCode().equals(seatDTO.getCode()) &&
                seatRepo.findByCode(seatDTO.getCode()).isPresent()) {
            throw new RuntimeException("Seat with code " + seatDTO.getCode() + " already exists");
        }

        if (!seat.getId().equals(seatDTO.getId()) &&
                seatRepo.findById(seatDTO.getId()).isPresent()) {
            throw new RuntimeException("Seat with desk ID " + seatDTO.getId() + " already exists");
        }

        seat.setCode(seatDTO.getCode());
        seat.setLocation(seatDTO.getLocation());
        seat.setBuilding(seatDTO.getBuilding());
        seat.setFloor(seatDTO.getFloor());
        seat.setSegment(seatDTO.getSegment());
        seat.setIsAvailable(seatDTO.getIsAvailable());
        seat.setId(seatDTO.getId());

        return seatMapper.toDTO(seatRepo.save(seat));
    }

    @Override
    public SeatDTO updateSeatAvailability(Long id, Boolean isAvailable) {
        Seat seat = seatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));

        seat.setIsAvailable(isAvailable);
        return seatMapper.toDTO(seatRepo.save(seat));
    }

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
