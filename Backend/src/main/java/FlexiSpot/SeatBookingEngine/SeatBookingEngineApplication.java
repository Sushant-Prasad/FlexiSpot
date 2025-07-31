package FlexiSpot.SeatBookingEngine;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Enables support for scheduled tasks
public class SeatBookingEngineApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.load(); // loads .env automatically

		System.setProperty("DB_USER", dotenv.get("DB_USER"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));

		//SpringApplication.run(MyApp.class, args);
		SpringApplication.run(SeatBookingEngineApplication.class, args);
	}
}
