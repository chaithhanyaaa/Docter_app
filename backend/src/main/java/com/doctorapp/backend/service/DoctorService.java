package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.Appointment;
import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.repository.AppointmentRepository;
import com.doctorapp.backend.repository.DoctorRepository;
import com.doctorapp.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService 
{

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private  final JwtService jwtService;
    private  final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         PasswordEncoder passwordEncoder,
                         JwtService jwtService,
                         AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService=jwtService;
        this.appointmentRepository=appointmentRepository;
    }

    public Doctor signup(Doctor doctor) {

        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Doctor email already registered");
        }

        // hash password
        String hashedPassword = passwordEncoder.encode(doctor.getPassword());
        doctor.setPassword(hashedPassword);

        // default status
        doctor.setStatus("PENDING");

        return doctorRepository.save(doctor);
    }


    public String login(String email, String password) {

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new RuntimeException("Invalid password");
        }


        return jwtService.generateToken(email);
    }


    public Doctor approveDoctor(Integer doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus("APPROVED");

        return doctorRepository.save(doctor);
    }


    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }



    public Doctor disapproveDoctor(Integer doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus("PENDING");

        return doctorRepository.save(doctor);
    }


    public void deleteDoctor(Integer doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doctor not found");
        }

        doctorRepository.deleteById(doctorId);
    }


    public List<Doctor> getAllApprovedDoctors() {
        return doctorRepository.findByStatus("APPROVED");
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


    public Doctor getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
}


