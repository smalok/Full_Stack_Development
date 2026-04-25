package com.veltech.events.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String department;
    private String studentId;
}
