package com.doctorapp.backend.controller;

import com.doctorapp.backend.entity.Appointment;
import com.doctorapp.backend.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")

public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // GET AVAILABLE SLOTS
    @GetMapping("/slots")
    public List<LocalTime> getAvailableSlots(
            @RequestParam Integer doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return appointmentService.getAvailableSlots(doctorId, date);
    }

    // BOOK APPOINTMENT
    @PostMapping
    public Appointment bookAppointment(@RequestBody Appointment appointment) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.bookAppointment(appointment, email);
    }

    // GET MY APPOINTMENTS (USER)
    @GetMapping("/my")
    public List<Appointment> getMyAppointments() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.getUserAppointments(email);
    }

    // CANCEL APPOINTMENT (USER)
    @PutMapping("/{appointmentId}/cancel")
    public String cancelAppointment(@PathVariable Integer appointmentId) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.cancelAppointment(appointmentId, email);
    }

    // GET DOCTOR'S APPOINTMENTS
    @GetMapping("/doctor")
    public List<Appointment> getDoctorAppointments() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.getDoctorAppointments(email);
    }

    // DOCTOR ACCEPTS APPOINTMENT
    @PutMapping("/{appointmentId}/accept")
    public Appointment acceptAppointment(@PathVariable Integer appointmentId) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.acceptAppointment(appointmentId, email);
    }

    // DOCTOR REJECTS APPOINTMENT
    @PutMapping("/{appointmentId}/reject")
    public Appointment rejectAppointment(@PathVariable Integer appointmentId) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return appointmentService.rejectAppointment(appointmentId, email);
    }
}