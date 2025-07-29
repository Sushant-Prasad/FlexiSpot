package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.SeatDTO;
import FlexiSpot.SeatBookingEngine.model.Seat;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SeatMapper {

    public SeatDTO toDTO(Seat seat) {
        if (seat == null) {
            return null;
        }

        return new SeatDTO(
                seat.getId(),
                seat.getCode(),
                seat.getLocation(),
                seat.getBuilding(),
                seat.getFloor(),
                seat.getSegment(),
                seat.getIsAvailable()
        );
    }

    public Seat toEntity(SeatDTO seatDTO) {
        if (seatDTO == null) {
            return null;
        }

        Seat seat = new Seat();
        seat.setId(seatDTO.getId());
        seat.setCode(seatDTO.getCode());
        seat.setLocation(seatDTO.getLocation());
        seat.setBuilding(seatDTO.getBuilding());
        seat.setFloor(seatDTO.getFloor());
        seat.setSegment(seatDTO.getSegment());
        seat.setIsAvailable(seatDTO.getIsAvailable());

        return seat;
    }

    public List<SeatDTO> toDTOList(List<Seat> seats) {
        if (seats == null) {
            return null;
        }

        return seats.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Seat> toEntityList(List<SeatDTO> seatDTOs) {
        if (seatDTOs == null) {
            return null;
        }

        return seatDTOs.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
