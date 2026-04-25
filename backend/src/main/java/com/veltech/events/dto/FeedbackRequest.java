package com.veltech.events.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;
}
