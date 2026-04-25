package com.veltech.events.controller;

import com.veltech.events.dto.ApiResponse;
import com.veltech.events.entity.Event;
import com.veltech.events.service.EventService;
import com.veltech.events.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllEvents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<Event> events;
        if (department != null || eventType != null || status != null || search != null) {
            events = eventService.filterEvents(department, eventType, status, search);
        } else {
            events = eventService.getAllEvents();
        }
        return ResponseEntity.ok(ApiResponse.success("Events fetched", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);

        // Build response with feedback stats
        Map<String, Object> data = new HashMap<>();
        data.put("event", event);
        data.put("feedbackStats", feedbackService.getEventFeedbackStats(id));

        return ResponseEntity.ok(ApiResponse.success("Event details fetched", data));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse> getUpcomingEvents() {
        return ResponseEntity.ok(ApiResponse.success("Upcoming events", eventService.getUpcomingEvents()));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getEventStats() {
        return ResponseEntity.ok(ApiResponse.success("Event stats", eventService.getEventStats()));
    }
}
