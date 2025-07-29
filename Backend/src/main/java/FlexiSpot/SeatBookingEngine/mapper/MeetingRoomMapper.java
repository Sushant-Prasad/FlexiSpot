package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.MeetingRoomDTO;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MeetingRoomMapper {

    public MeetingRoomDTO toDTO(MeetingRoom meetingRoom) {
        if (meetingRoom == null) {
            return null;
        }

        return new MeetingRoomDTO(
                meetingRoom.getId(),
                meetingRoom.getRoomCode(),
                meetingRoom.getLocation(),
                meetingRoom.getBuilding(),
                meetingRoom.getFloor(),
                meetingRoom.getIsAvailable()
        );
    }

    public MeetingRoom toEntity(MeetingRoomDTO meetingRoomDTO) {
        if (meetingRoomDTO == null) {
            return null;
        }

        MeetingRoom meetingRoom = new MeetingRoom();
        meetingRoom.setId(meetingRoomDTO.getId());
        meetingRoom.setRoomCode(meetingRoomDTO.getRoomCode());
        meetingRoom.setLocation(meetingRoomDTO.getLocation());
        meetingRoom.setBuilding(meetingRoomDTO.getBuilding());
        meetingRoom.setFloor(meetingRoomDTO.getFloor());
        meetingRoom.setIsAvailable(meetingRoomDTO.getIsAvailable());

        return meetingRoom;
    }

    public List<MeetingRoomDTO> toDTOList(List<MeetingRoom> meetingRooms) {
        if (meetingRooms == null) {
            return null;
        }

        return meetingRooms.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MeetingRoom> toEntityList(List<MeetingRoomDTO> meetingRoomDTOs) {
        if (meetingRoomDTOs == null) {
            return null;
        }

        return meetingRoomDTOs.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
