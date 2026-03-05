package com.doctorapp.backend.controller;


import com.doctorapp.backend.repository.UserRepository;
import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signupUser(@RequestBody User user) {
        User savedUser = userService.signup(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/test")
    public String test()
    {
        return "testing done";
    }





    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getUsers()
    {
        return userService.getUsers();

    }

    @GetMapping("/getuser/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id)
    {
        return userService.getUserById(id);
    }
}
