package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    // Add custom queries if needed, e.g.:
    User findByEmail(String email);
}



