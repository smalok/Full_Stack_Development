package com.veltech.events.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Event date is required")
    @Column(nullable = false)
    private LocalDate eventDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Venue is required")
    @Column(nullable = false)
    private String venue;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    @NotBlank(message = "Event type is required")
    @Column(nullable = false)
    private String eventType; // Workshop, Seminar, Hackathon, Cultural, Sports, Guest Lecture, Tech Fest

    @NotNull(message = "Max capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer maxCapacity;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentRegistrations = 0;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EventStatus status = EventStatus.UPCOMING;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isFree = true;

    private Double fee;

    private LocalDate registrationDeadline;

    private String speakers; // comma-separated speaker names

    private String speakerDesignations; // comma-separated

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum EventStatus {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}
