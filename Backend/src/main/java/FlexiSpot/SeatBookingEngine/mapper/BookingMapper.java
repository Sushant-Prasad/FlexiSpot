package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.model.Booking;
import FlexiSpot.SeatBookingEngine.model.BookingStatus;
import FlexiSpot.SeatBookingEngine.model.Seat;
import FlexiSpot.SeatBookingEngine.model.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;

        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getName());
        }

        if (booking.getSeat() != null) {
            dto.setSeatId(booking.getSeat().getId());
            dto.setSeatCode(booking.getSeat().getCode());
        }

        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus());

        return dto;
    }

    public Booking toEntity(BookingDTO dto) {
        if (dto == null) return null;

        Booking booking = new Booking();

        booking.setId(dto.getId());
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            booking.setUser(user);
        }

        if (dto.getSeatId() != null) {
            Seat seat = new Seat();
            seat.setId(dto.getSeatId());
            booking.setSeat(seat);
        }

        if (dto.getStatus() != null) {
            booking.setStatus(dto.getStatus());
        }

        return booking;
    }
}
