package com.veltech.events.config;

import com.veltech.events.entity.Event;
import com.veltech.events.entity.Event.EventStatus;
import com.veltech.events.entity.User;
import com.veltech.events.entity.User.Role;
import com.veltech.events.repository.EventRepository;
import com.veltech.events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed admin user
        if (!userRepository.existsByEmail("admin@veltech.edu.in")) {
            User admin = User.builder()
                    .fullName("Admin")
                    .email("admin@veltech.edu.in")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .department("Administration")
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@veltech.edu.in / admin123");
        }

        // Seed sample events
        if (eventRepository.count() == 0) {
            eventRepository.save(Event.builder()
                    .title("National Level Hackathon 2026")
                    .description("A 24-hour coding competition where teams build innovative solutions. Open to all departments. Prizes worth ₹50,000! Mentors from top tech companies will guide participants.")
                    .eventDate(LocalDate.of(2026, 5, 15))
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(9, 0))
                    .venue("Main Auditorium, Block A")
                    .department("CSE")
                    .eventType("Hackathon")
                    .maxCapacity(150)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(true)
                    .registrationDeadline(LocalDate.of(2026, 5, 10))
                    .speakers("Dr. Ramesh Kumar, Priya Sharma")
                    .speakerDesignations("Professor CSE, Senior Engineer Google")
                    .build());

            eventRepository.save(Event.builder()
                    .title("AI & Machine Learning Workshop")
                    .description("Hands-on workshop covering neural networks, deep learning with TensorFlow, and real-world ML applications. Bring your laptop with Python installed.")
                    .eventDate(LocalDate.of(2026, 5, 20))
                    .startTime(LocalTime.of(10, 0))
                    .endTime(LocalTime.of(16, 0))
                    .venue("Seminar Hall - Block B")
                    .department("AI & Data Science")
                    .eventType("Workshop")
                    .maxCapacity(100)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(true)
                    .registrationDeadline(LocalDate.of(2026, 5, 18))
                    .speakers("Dr. Anita Desai")
                    .speakerDesignations("HOD AI & DS")
                    .build());

            eventRepository.save(Event.builder()
                    .title("Guest Lecture: AI in Healthcare")
                    .description("Industry expert from Apollo Hospitals shares insights on how artificial intelligence is transforming healthcare diagnostics and patient care.")
                    .eventDate(LocalDate.of(2026, 5, 25))
                    .startTime(LocalTime.of(14, 0))
                    .endTime(LocalTime.of(16, 30))
                    .venue("Conference Hall, Admin Block")
                    .department("Biotechnology")
                    .eventType("Guest Lecture")
                    .maxCapacity(200)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(true)
                    .registrationDeadline(LocalDate.of(2026, 5, 23))
                    .speakers("Dr. Venkat Reddy")
                    .speakerDesignations("Chief AI Officer, Apollo Hospitals")
                    .build());

            eventRepository.save(Event.builder()
                    .title("Cultural Fest - Crescendo 2026")
                    .description("Annual cultural festival featuring music, dance, drama, and art competitions. Open to all students. Register your team for group events!")
                    .eventDate(LocalDate.of(2026, 6, 1))
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(21, 0))
                    .venue("Open Air Theatre")
                    .department("Science & Humanities")
                    .eventType("Cultural")
                    .maxCapacity(500)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(true)
                    .registrationDeadline(LocalDate.of(2026, 5, 28))
                    .build());

            eventRepository.save(Event.builder()
                    .title("Workshop: Cloud Computing with AWS")
                    .description("Learn to deploy applications on AWS. Covers EC2, S3, Lambda, and real-world architecture patterns. AWS certified instructor.")
                    .eventDate(LocalDate.of(2026, 6, 5))
                    .startTime(LocalTime.of(10, 0))
                    .endTime(LocalTime.of(17, 0))
                    .venue("Computer Lab 3, Block C")
                    .department("Information Technology")
                    .eventType("Workshop")
                    .maxCapacity(60)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(false)
                    .fee(200.0)
                    .registrationDeadline(LocalDate.of(2026, 6, 3))
                    .speakers("Vikram Singh")
                    .speakerDesignations("AWS Solutions Architect")
                    .build());

            eventRepository.save(Event.builder()
                    .title("Seminar: Cybersecurity Trends 2026")
                    .description("Explore the latest in cybersecurity — threat landscape, zero-trust architecture, and career opportunities in infosec.")
                    .eventDate(LocalDate.of(2026, 6, 10))
                    .startTime(LocalTime.of(11, 0))
                    .endTime(LocalTime.of(13, 0))
                    .venue("Room 201, Block A")
                    .department("CSE")
                    .eventType("Seminar")
                    .maxCapacity(120)
                    .currentRegistrations(0)
                    .status(EventStatus.UPCOMING)
                    .isFree(true)
                    .registrationDeadline(LocalDate.of(2026, 6, 8))
                    .speakers("Kavitha Nair")
                    .speakerDesignations("Security Lead, Wipro")
                    .build());

            eventRepository.save(Event.builder()
                    .title("Sports Day 2026")
                    .description("Annual inter-department sports competition. Events include cricket, basketball, athletics, volleyball, and chess.")
                    .eventDate(LocalDate.of(2026, 4, 10))
                    .startTime(LocalTime.of(7, 0))
                    .endTime(LocalTime.of(18, 0))
                    .venue("Sports Complex")
                    .department("Physical Education")
                    .eventType("Sports")
                    .maxCapacity(300)
                    .currentRegistrations(0)
                    .status(EventStatus.COMPLETED)
                    .isFree(true)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Tech Fest - VISAI 2026")
                    .description("Vel Tech's flagship international project competition and exhibition. Showcase your projects, compete with peers across the nation!")
                    .eventDate(LocalDate.of(2026, 3, 20))
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(17, 0))
                    .venue("Central Expo Hall")
                    .department("All Departments")
                    .eventType("Tech Fest")
                    .maxCapacity(1000)
                    .currentRegistrations(0)
                    .status(EventStatus.COMPLETED)
                    .isFree(true)
                    .build());

            log.info("✅ 8 sample events seeded successfully");
        }
    }
}
