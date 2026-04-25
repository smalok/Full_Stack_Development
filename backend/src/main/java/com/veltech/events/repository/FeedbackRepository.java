package com.veltech.events.repository;

import com.veltech.events.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByEventId(Long eventId);

    List<Feedback> findByUserId(Long userId);

    Optional<Feedback> findByUserIdAndEventId(Long userId, Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.event.id = :eventId")
    Double getAverageRatingByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.event.id = :eventId")
    long countByEventId(@Param("eventId") Long eventId);
}
