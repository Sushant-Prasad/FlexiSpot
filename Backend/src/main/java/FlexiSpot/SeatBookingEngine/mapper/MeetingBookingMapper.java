package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import org.springframework.stereotype.Component;

@Component
public class MeetingBookingMapper {

    // ======================
    // Entity → DTO
    // ======================
    public MeetingBookingDTO toDTO(MeetingBooking booking) {
        if (booking == null) return null;

        MeetingBookingDTO dto = new MeetingBookingDTO();
        dto.setId(booking.getId());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getName());
        }

        if (booking.getRoom() != null) {
            dto.setMeetingRoomId(booking.getRoom().getId());
            dto.setMeetingRoomCode(booking.getRoom().getRoomCode());
        }

        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());

        return dto;
    }

    // ======================
    // DTO → Entity
    // ======================
    public MeetingBooking toEntity(MeetingBookingDTO dto) {
        if (dto == null) return null;

        MeetingBooking booking = new MeetingBooking();

        // ❌ DO NOT set ID
        // ❌ DO NOT set User
        // ❌ DO NOT set MeetingRoom

        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setStatus(dto.getStatus());

        return booking;
    }
}
