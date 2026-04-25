package com.veltech.events.controller;

import com.veltech.events.dto.ApiResponse;
import com.veltech.events.dto.FeedbackRequest;
import com.veltech.events.entity.Feedback;
import com.veltech.events.entity.User;
import com.veltech.events.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse> submitFeedback(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FeedbackRequest request) {
        Feedback feedback = feedbackService.submitFeedback(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted!", feedback));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse> getEventFeedbacks(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Feedbacks", feedbackService.getEventFeedbacks(eventId)));
    }

    @GetMapping("/check/{eventId}")
    public ResponseEntity<ApiResponse> checkFeedback(
            @AuthenticationPrincipal User user,
            @PathVariable Long eventId) {
        boolean hasGiven = feedbackService.hasUserGivenFeedback(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Feedback check",
                Map.of("hasGivenFeedback", hasGiven)));
    }
}
