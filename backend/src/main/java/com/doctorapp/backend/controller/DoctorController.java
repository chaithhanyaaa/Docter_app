package com.doctorapp.backend.controller;

import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.service.DoctorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/signup")
    public Doctor signupDoctor(@RequestBody Doctor doctor) {
        return doctorService.signup(doctor);
    }
}