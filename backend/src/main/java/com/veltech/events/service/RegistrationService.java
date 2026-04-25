package com.veltech.events.service;

import com.veltech.events.entity.*;
import com.veltech.events.entity.Registration.RegistrationStatus;
import com.veltech.events.exception.ResourceNotFoundException;
import com.veltech.events.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public Registration registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Check if already registered
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new IllegalArgumentException("You are already registered for this event");
        }

        // Check capacity
        if (event.getCurrentRegistrations() >= event.getMaxCapacity()) {
            throw new IllegalArgumentException("Event is fully booked. No spots available.");
        }

        // Check if event is upcoming
        if (event.getStatus() != Event.EventStatus.UPCOMING && event.getStatus() != Event.EventStatus.ONGOING) {
            throw new IllegalArgumentException("Registration is not open for this event");
        }

        // Create registration
        Registration registration = Registration.builder()
                .user(user)
                .event(event)
                .status(RegistrationStatus.CONFIRMED)
                .build();

        registration = registrationRepository.save(registration);

        // Update event registration count
        event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
        eventRepository.save(event);

        return registration;
    }

    @Transactional
    public void cancelRegistration(Long userId, Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (!registration.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own registrations");
        }

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new IllegalArgumentException("Registration is already cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);

        // Decrement event count
        Event event = registration.getEvent();
        event.setCurrentRegistrations(Math.max(0, event.getCurrentRegistrations() - 1));
        eventRepository.save(event);
    }

    public List<Registration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    public List<Registration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    public boolean isUserRegistered(Long userId, Long eventId) {
        return registrationRepository.existsByUserIdAndEventId(userId, eventId);
    }

    /**
     * Export registered students for an event as Excel (.xlsx)
     */
    public byte[] exportRegistrationsToExcel(Long eventId) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEventId(eventId);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            // Sanitize sheet name: Excel doesn't allow : \ / ? * [ ] and max 31 chars
            String sheetName = event.getTitle().replaceAll("[:\\\\/?*\\[\\]]", "").trim();
            if (sheetName.length() > 31) sheetName = sheetName.substring(0, 31);
            if (sheetName.isEmpty()) sheetName = "Registrations";
            Sheet sheet = workbook.createSheet(sheetName);

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"S.No", "Student Name", "Register Number", "Email", "Phone",
                                "Department", "Year", "Status", "Registered On"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
            int rowNum = 1;
            for (Registration reg : registrations) {
                Row row = sheet.createRow(rowNum);
                User user = reg.getUser();
                row.createCell(0).setCellValue(rowNum);
                row.createCell(1).setCellValue(user.getFullName());
                row.createCell(2).setCellValue(user.getStudentId() != null ? user.getStudentId() : "N/A");
                row.createCell(3).setCellValue(user.getEmail());
                row.createCell(4).setCellValue(user.getPhone() != null ? user.getPhone() : "N/A");
                row.createCell(5).setCellValue(user.getDepartment() != null ? user.getDepartment() : "N/A");
                row.createCell(6).setCellValue(user.getYearOfStudy() != null ? user.getYearOfStudy() : "N/A");
                row.createCell(7).setCellValue(reg.getStatus().name());
                row.createCell(8).setCellValue(reg.getRegisteredAt() != null ? reg.getRegisteredAt().format(formatter) : "N/A");
                rowNum++;
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}
