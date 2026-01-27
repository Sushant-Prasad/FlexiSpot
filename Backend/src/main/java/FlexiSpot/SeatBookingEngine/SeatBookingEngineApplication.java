package FlexiSpot.SeatBookingEngine;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling  // ✅ Enables scheduler (@Scheduled)
public class SeatBookingEngineApplication {

	// ✅ Force JVM timezone (CRITICAL for Render)
	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
		System.out.println("✅ JVM Timezone set to: " + TimeZone.getDefault().getID());
	}

	public static void main(String[] args) {
		SpringApplication.run(SeatBookingEngineApplication.class, args);
	}
}
