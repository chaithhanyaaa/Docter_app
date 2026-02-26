package com.doctorapp.backend.controller;


import com.doctorapp.backend.repository.UserRepository;
import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public User signupUser(@RequestBody User user) {
        return userService.signup(user);
    }
}
