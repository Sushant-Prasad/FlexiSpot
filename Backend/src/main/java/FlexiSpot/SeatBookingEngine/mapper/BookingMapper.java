package FlexiSpot.SeatBookingEngine.mapper;

import FlexiSpot.SeatBookingEngine.DTO.BookingDTO;
import FlexiSpot.SeatBookingEngine.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    // ======================
    // Entity → DTO
    // ======================
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

    // ======================
    // DTO → Entity
    // ======================
    public Booking toEntity(BookingDTO dto) {
        if (dto == null) return null;

        Booking booking = new Booking();

        // ❌ DO NOT set booking ID (DB handles it)
        booking.setDate(dto.getDate());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setStatus(dto.getStatus());

        // ❌ DO NOT set User / Seat here
        // ✔ They must be fetched & set in Service layer

        return booking;
    }
}
