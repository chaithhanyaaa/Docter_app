package com.doctorapp.backend.controller;

import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.service.DoctorService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "*")

public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // DOCTOR SIGNUP
    @PostMapping("/signup")
    public Doctor signupDoctor(@RequestBody Doctor doctor) {
        return doctorService.signup(doctor);
    }

    // GET ALL APPROVED DOCTORS (for user page)
    @GetMapping
    public List<Doctor> getAllApprovedDoctors() {
        return doctorService.getAllApprovedDoctors();
    }



    // GET LOGGED IN DOCTOR PROFILE
    @GetMapping("/me")
    public Doctor getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return doctorService.getDoctorByEmail(email);
    }
}