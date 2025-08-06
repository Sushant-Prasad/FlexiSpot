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

		System.setProperty("db_username", dotenv.get("db_username"));
		System.setProperty("db_password", dotenv.get("db_username"));
		System.setProperty("db_url", dotenv.get("db_url"));
		

		//SpringApplication.run(MyApp.class, args);
		SpringApplication.run(SeatBookingEngineApplication.class, args);
	}
}
