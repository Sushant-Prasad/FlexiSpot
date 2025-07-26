package FlexiSpot.SeatBookingEngine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Enables support for scheduled tasks
public class SeatBookingEngineApplication {

	public static void main(String[] args) {
		SpringApplication.run(SeatBookingEngineApplication.class, args);
	}
}
