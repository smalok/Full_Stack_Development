package com.veltech.events.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "event_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    @Column(updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
    }

    public enum RegistrationStatus {
        CONFIRMED, CANCELLED, ATTENDED
    }
}
