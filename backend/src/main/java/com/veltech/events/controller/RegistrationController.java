package com.veltech.events.controller;

import com.veltech.events.dto.ApiResponse;
import com.veltech.events.entity.Registration;
import com.veltech.events.entity.User;
import com.veltech.events.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    public ResponseEntity<ApiResponse> registerForEvent(
            @AuthenticationPrincipal User user,
            @PathVariable Long eventId) {
        Registration registration = registrationService.registerForEvent(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Registered successfully!", registration));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyRegistrations(@AuthenticationPrincipal User user) {
        List<Registration> registrations = registrationService.getUserRegistrations(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Your registrations", registrations));
    }

    @PutMapping("/{registrationId}/cancel")
    public ResponseEntity<ApiResponse> cancelRegistration(
            @AuthenticationPrincipal User user,
            @PathVariable Long registrationId) {
        registrationService.cancelRegistration(user.getId(), registrationId);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled"));
    }

    @GetMapping("/check/{eventId}")
    public ResponseEntity<ApiResponse> checkRegistration(
            @AuthenticationPrincipal User user,
            @PathVariable Long eventId) {
        boolean isRegistered = registrationService.isUserRegistered(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Registration check",
                Map.of("isRegistered", isRegistered)));
    }
}
