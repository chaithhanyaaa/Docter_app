package com.doctorapp.backend.controller;

import com.doctorapp.backend.dto.LoginRequest;
import com.doctorapp.backend.security.JwtService;
import com.doctorapp.backend.service.DoctorService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor-auth")
@CrossOrigin(origins = "*")

public class DoctorAuthController {

    private final DoctorService doctorService;

    public DoctorAuthController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/login")
    public String loginDoctor(@RequestBody LoginRequest request) {
        System.out.println(request.getEmail());

        return doctorService.login(request.getEmail(), request.getPassword());

    }
}