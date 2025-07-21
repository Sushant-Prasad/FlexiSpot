package FlexiSpot.SeatBookingEngine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_integrations")
public class CalendarIntegration {

    // Shared primary key with User (User ID is primary key here)
    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank(message = "Calendar type is required")
    @Column(name = "calendar_type", nullable = false)
    private String calendarType;

    @NotBlank(message = "Access token is required")
    @Lob
    @Column(name = "access_token", nullable = false, columnDefinition = "TEXT")
    private String accessToken;

    @Lob
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

    @Column(name = "has_calendar_integration")
    private Boolean hasCalendarIntegration = false;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    // === Constructors ===
    public CalendarIntegration() {}

    public CalendarIntegration(User user, String calendarType, String accessToken, String refreshToken,
                               LocalDateTime tokenExpiry, Boolean hasCalendarIntegration, LocalDateTime lastSyncedAt) {
        this.user = user;
        this.calendarType = calendarType;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiry = tokenExpiry;
        this.hasCalendarIntegration = hasCalendarIntegration;
        this.lastSyncedAt = lastSyncedAt;
    }

    // === Getters and Setters ===

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCalendarType() {
        return calendarType;
    }

    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public LocalDateTime getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(LocalDateTime tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public Boolean getHasCalendarIntegration() {
        return hasCalendarIntegration;
    }

    public void setHasCalendarIntegration(Boolean hasCalendarIntegration) {
        this.hasCalendarIntegration = hasCalendarIntegration;
    }

    public LocalDateTime getLastSyncedAt() {
        return lastSyncedAt;
    }

    public void setLastSyncedAt(LocalDateTime lastSyncedAt) {
        this.lastSyncedAt = lastSyncedAt;
    }
}
