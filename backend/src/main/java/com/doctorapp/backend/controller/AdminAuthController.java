package com.doctorapp.backend.controller;

import com.doctorapp.backend.dto.LoginRequest;
import com.doctorapp.backend.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin-auth")
@CrossOrigin(origins = "*")

public class AdminAuthController {

    private final AdminService adminService;

    public AdminAuthController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return adminService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
}