package com.veltech.events.service;

import com.veltech.events.entity.Event;
import com.veltech.events.entity.Event.EventStatus;
import com.veltech.events.exception.ResourceNotFoundException;
import com.veltech.events.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findTop6ByStatusOrderByEventDateAsc(EventStatus.UPCOMING);
    }

    public List<Event> filterEvents(String department, String eventType, String status, String search) {
        EventStatus eventStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                eventStatus = EventStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // ignore invalid status
            }
        }
        return eventRepository.findWithFilters(
                (department != null && !department.isEmpty()) ? department : null,
                (eventType != null && !eventType.isEmpty()) ? eventType : null,
                eventStatus,
                (search != null && !search.isEmpty()) ? search : null
        );
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setStartTime(eventDetails.getStartTime());
        event.setEndTime(eventDetails.getEndTime());
        event.setVenue(eventDetails.getVenue());
        event.setDepartment(eventDetails.getDepartment());
        event.setEventType(eventDetails.getEventType());
        event.setMaxCapacity(eventDetails.getMaxCapacity());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setStatus(eventDetails.getStatus());
        event.setIsFree(eventDetails.getIsFree());
        event.setFee(eventDetails.getFee());
        event.setRegistrationDeadline(eventDetails.getRegistrationDeadline());
        event.setSpeakers(eventDetails.getSpeakers());
        event.setSpeakerDesignations(eventDetails.getSpeakerDesignations());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    public Map<String, Object> getEventStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", eventRepository.count());
        stats.put("upcoming", eventRepository.countByStatus(EventStatus.UPCOMING));
        stats.put("ongoing", eventRepository.countByStatus(EventStatus.ONGOING));
        stats.put("completed", eventRepository.countByStatus(EventStatus.COMPLETED));
        stats.put("cancelled", eventRepository.countByStatus(EventStatus.CANCELLED));
        return stats;
    }
}
