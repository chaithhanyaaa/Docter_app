package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.repository.DoctorRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository,
                         BCryptPasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Doctor signup(Doctor doctor) {

        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Doctor email already registered");
        }

        // hash password
        String hashedPassword = passwordEncoder.encode(doctor.getPassword());
        doctor.setPassword(hashedPassword);

        // set default status
        doctor.setStatus("PENDING");

        System.out.println("done");

        return doctorRepository.save(doctor);
    }
}