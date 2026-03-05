package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.Appointment;
import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.repository.AppointmentRepository;
import com.doctorapp.backend.repository.DoctorRepository;
import com.doctorapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    // GET AVAILABLE SLOTS
    public List<LocalTime> getAvailableSlots(Integer doctorId, LocalDate date) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Appointment> bookedAppointments =
                appointmentRepository.findByDoctorAndAppointmentDate(doctor, date);

        List<LocalTime> bookedSlots = new ArrayList<>();
        for (Appointment appointment : bookedAppointments) {
            bookedSlots.add(appointment.getAppointmentTime());
        }

        List<LocalTime> allSlots = new ArrayList<>();
        LocalTime start = LocalTime.of(10, 0);
        LocalTime end = LocalTime.of(17, 0);

        while (start.isBefore(end)) {
            allSlots.add(start);
            start = start.plusMinutes(30);
        }

        allSlots.removeAll(bookedSlots);
        return allSlots;
    }

    // BOOK APPOINTMENT
    public Appointment bookAppointment(Appointment appointment, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointment.setUser(user);

        boolean exists = appointmentRepository
                .existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
                        appointment.getDoctor().getDoctorId(),
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        if (exists) {
            throw new RuntimeException("Slot already booked");
        }

        appointment.setStatus("PENDING");
        return appointmentRepository.save(appointment);
    }

    // GET USER APPOINTMENTS
    public List<Appointment> getUserAppointments(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return appointmentRepository.findByUser_UserId(user.getUserId());
    }

    // CANCEL APPOINTMENT (USER)
    public String cancelAppointment(Integer appointmentId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized: This is not your appointment");
        }

        if (!appointment.getAppointmentDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot cancel: Appointment date has already passed");
        }

        if (appointment.getStatus().equals("CANCELLED")) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
        return "Appointment cancelled successfully";
    }

    // GET DOCTOR'S APPOINTMENTS
    public List<Appointment> getDoctorAppointments(String email) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return appointmentRepository.findByDoctor(doctor);
    }

    // DOCTOR ACCEPTS APPOINTMENT
    public Appointment acceptAppointment(Integer appointmentId, String email) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new RuntimeException("Unauthorized: This is not your appointment");
        }

        appointment.setStatus("ACCEPTED");
        return appointmentRepository.save(appointment);
    }

    // DOCTOR REJECTS APPOINTMENT
    public Appointment rejectAppointment(Integer appointmentId, String email) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getDoctorId().equals(doctor.getDoctorId())) {
            throw new RuntimeException("Unauthorized: This is not your appointment");
        }

        appointment.setStatus("REJECTED");
        return appointmentRepository.save(appointment);
    }
}