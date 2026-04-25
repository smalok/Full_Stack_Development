package com.veltech.events.service;

import com.veltech.events.dto.FeedbackRequest;
import com.veltech.events.entity.*;
import com.veltech.events.exception.ResourceNotFoundException;
import com.veltech.events.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public Feedback submitFeedback(Long userId, FeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Check if user was registered for this event
        if (!registrationRepository.existsByUserIdAndEventId(userId, request.getEventId())) {
            throw new IllegalArgumentException("You must be registered for the event to give feedback");
        }

        // Check if feedback already given
        if (feedbackRepository.existsByUserIdAndEventId(userId, request.getEventId())) {
            throw new IllegalArgumentException("You have already submitted feedback for this event");
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .event(event)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getEventFeedbacks(Long eventId) {
        return feedbackRepository.findByEventId(eventId);
    }

    public Map<String, Object> getEventFeedbackStats(Long eventId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", feedbackRepository.getAverageRatingByEventId(eventId));
        stats.put("totalFeedbacks", feedbackRepository.countByEventId(eventId));
        stats.put("feedbacks", feedbackRepository.findByEventId(eventId));
        return stats;
    }

    public boolean hasUserGivenFeedback(Long userId, Long eventId) {
        return feedbackRepository.existsByUserIdAndEventId(userId, eventId);
    }
}
