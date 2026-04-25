package com.veltech.events.service;

import com.veltech.events.config.JwtUtil;
import com.veltech.events.dto.*;
import com.veltech.events.entity.User;
import com.veltech.events.entity.User.Role;
import com.veltech.events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered. Please login instead.");
        }

        // Treat blank studentId as null to avoid unique constraint issues
        String studentId = (request.getStudentId() != null && !request.getStudentId().trim().isEmpty())
                ? request.getStudentId().trim() : null;

        if (studentId != null && userRepository.existsByStudentId(studentId)) {
            throw new IllegalArgumentException("Student ID is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .studentId(studentId)
                .phone(request.getPhone())
                .department(request.getDepartment())
                .yearOfStudy(request.getYearOfStudy())
                .role(Role.STUDENT)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .studentId(user.getStudentId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email. Please sign up first."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password. Please try again.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .studentId(user.getStudentId())
                .build();
    }
}
