package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.MeetingBookingDTO;
import FlexiSpot.SeatBookingEngine.model.MeetingBooking;
import FlexiSpot.SeatBookingEngine.model.MeetingRoom;
import FlexiSpot.SeatBookingEngine.model.User;
import org.springframework.stereotype.Component;

@Component
public class MeetingBookingMapper {

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

        //Set booking status
        dto.setStatus(booking.getStatus());

        return dto;
    }

    public MeetingBooking toEntity(MeetingBookingDTO dto) {
        if (dto == null) return null;

        MeetingBooking booking = new MeetingBooking();
        booking.setId(dto.getId());
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            booking.setUser(user);
        }

        if (dto.getMeetingRoomId() != null) {
            MeetingRoom room = new MeetingRoom();
            room.setId(dto.getMeetingRoomId());
            booking.setRoom(room);
        }

        // Set booking status
        booking.setStatus(dto.getStatus());

        return booking;
    }
}
