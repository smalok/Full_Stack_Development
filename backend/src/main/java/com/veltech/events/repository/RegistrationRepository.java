package com.veltech.events.repository;

import com.veltech.events.entity.Registration;
import com.veltech.events.entity.Registration.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserId(Long userId);

    List<Registration> findByEventId(Long eventId);

    List<Registration> findByUserIdAndStatus(Long userId, RegistrationStatus status);

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    long countConfirmedByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.user.id = :userId AND r.status != 'CANCELLED'")
    long countActiveByUserId(@Param("userId") Long userId);
}
