package FlexiSpot.SeatBookingEngine.service;

import FlexiSpot.SeatBookingEngine.DTO.MeetingRoomDTO;
import FlexiSpot.SeatBookingEngine.mapper.MeetingRoomMapper;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.repository.MeetingRoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MeetingRoomManagementServiceImpl implements MeetingRoomManagementService {

    @Autowired
    private MeetingRoomRepo meetingRoomRepo;

    @Autowired
    private MeetingRoomMapper meetingRoomMapper;

    @Override
    public MeetingRoomDTO createMeetingRoom(MeetingRoomDTO meetingRoomDTO) {
        if (meetingRoomRepo.findByRoomCode(meetingRoomDTO.getRoomCode()).isPresent()) {
            throw new RuntimeException("Meeting room with code " + meetingRoomDTO.getRoomCode() + " already exists");
        }

        MeetingRoom meetingRoom = meetingRoomMapper.toEntity(meetingRoomDTO);
        MeetingRoom savedMeetingRoom = meetingRoomRepo.save(meetingRoom);
        return meetingRoomMapper.toDTO(savedMeetingRoom);
    }

    @Override
    public List<MeetingRoomDTO> getAllMeetingRooms() {
        return meetingRoomMapper.toDTOList(meetingRoomRepo.findAll());
    }

    @Override
    public MeetingRoomDTO getMeetingRoomById(Long id) {
        return meetingRoomRepo.findById(id)
                .map(meetingRoomMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Meeting room not found with id: " + id));
    }

    @Override
    public List<MeetingRoomDTO> getAvailableMeetingRooms() {
        return meetingRoomMapper.toDTOList(meetingRoomRepo.findByIsAvailableTrue());
    }

    @Override
    public List<MeetingRoomDTO> getMeetingRoomsByFilters(String location, String building, String floor) {
        return meetingRoomMapper.toDTOList(meetingRoomRepo.findRoomsByFilters(location, building, floor));
    }

    @Override
    public MeetingRoomDTO updateMeetingRoom(Long id, MeetingRoomDTO dto) {
        MeetingRoom room = meetingRoomRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting room not found with id: " + id));

        if (!room.getRoomCode().equals(dto.getRoomCode()) &&
                meetingRoomRepo.findByRoomCode(dto.getRoomCode()).isPresent()) {
            throw new RuntimeException("Meeting room with code " + dto.getRoomCode() + " already exists");
        }

        room.setRoomCode(dto.getRoomCode());
        room.setLocation(dto.getLocation());
        room.setBuilding(dto.getBuilding());
        room.setFloor(dto.getFloor());
        room.setIsAvailable(dto.getIsAvailable());

        return meetingRoomMapper.toDTO(meetingRoomRepo.save(room));
    }

    @Override
    public MeetingRoomDTO updateMeetingRoomAvailability(Long id, Boolean isAvailable) {
        MeetingRoom room = meetingRoomRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting room not found with id: " + id));

        room.setIsAvailable(isAvailable);
        return meetingRoomMapper.toDTO(meetingRoomRepo.save(room));
    }

    @Override
    public void deleteMeetingRoom(Long id) {
        if (!meetingRoomRepo.existsById(id)) {
            throw new RuntimeException("Meeting room not found with id: " + id);
        }
        meetingRoomRepo.deleteById(id);
    }

    @Override
    public List<MeetingRoomDTO> createMultipleMeetingRooms(List<MeetingRoomDTO> dtos) {
        List<MeetingRoom> rooms = meetingRoomMapper.toEntityList(dtos);
        return meetingRoomMapper.toDTOList(meetingRoomRepo.saveAll(rooms));
    }

    @Override
    public void deleteMultipleMeetingRooms(List<Long> ids) {
        meetingRoomRepo.deleteAllById(ids);
    }
}
