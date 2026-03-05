package com.doctorapp.backend.controller;

import com.doctorapp.backend.dto.LoginRequest;
import com.doctorapp.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userService.login(request.getEmail(), request.getPassword());

    }
}