package com.veltech.events.repository;

import com.veltech.events.entity.Event;
import com.veltech.events.entity.Event.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByDepartment(String department);

    List<Event> findByEventType(String eventType);

    List<Event> findByEventDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT e FROM Event e WHERE " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:eventType IS NULL OR e.eventType = :eventType) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.department) LIKE LOWER(CONCAT('%', :search, '%')))" +
           " ORDER BY e.eventDate DESC")
    List<Event> findWithFilters(
        @Param("department") String department,
        @Param("eventType") String eventType,
        @Param("status") EventStatus status,
        @Param("search") String search
    );

    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = :status")
    long countByStatus(@Param("status") EventStatus status);

    List<Event> findTop6ByStatusOrderByEventDateAsc(EventStatus status);
}
