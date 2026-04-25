package com.veltech.events.controller;

import com.veltech.events.dto.ApiResponse;
import com.veltech.events.entity.Event;
import com.veltech.events.entity.Registration;
import com.veltech.events.service.EventService;
import com.veltech.events.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final RegistrationService registrationService;

    // ========== EVENT CRUD ==========

    @PostMapping("/events")
    public ResponseEntity<ApiResponse> createEvent(@Valid @RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.ok(ApiResponse.success("Event created successfully", created));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse> updateEvent(@PathVariable Long id, @Valid @RequestBody Event event) {
        Event updated = eventService.updateEvent(id, event);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully"));
    }

    // ========== REGISTRATIONS ==========

    @GetMapping("/events/{eventId}/registrations")
    public ResponseEntity<ApiResponse> getEventRegistrations(@PathVariable Long eventId) {
        List<Registration> registrations = registrationService.getEventRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event registrations", registrations));
    }

    // ========== EXCEL EXPORT ==========

    @GetMapping("/events/{eventId}/export")
    public ResponseEntity<byte[]> exportRegistrations(@PathVariable Long eventId) throws IOException {
        byte[] excelBytes = registrationService.exportRegistrationsToExcel(eventId);
        Event event = eventService.getEventById(eventId);
        String filename = event.getTitle().replaceAll("[^a-zA-Z0-9]", "_") + "_Registrations.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    // ========== STATS ==========

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", eventService.getEventStats()));
    }
}
