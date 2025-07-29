package FlexiSpot.SeatBookingEngine.repository;

import FlexiSpot.SeatBookingEngine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // For login using name
    User findByName(String name);  // ✅ aligns with your model

    // For login using email (used in JwtRequestFilter)
    Optional<User> findByEmail(String email);

    // Check if email is already registered
    boolean existsByEmail(String email);

    // Optional: Find by employee ID if required
    Optional<User> findById(Integer Id);

}
