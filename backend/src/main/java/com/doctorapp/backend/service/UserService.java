package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.exception.DuplicateEmailException;
import com.doctorapp.backend.repository.UserRepository;
import com.doctorapp.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{
    final  private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public User signup(User user) {

        System.out.println("Password received: " + user.getPassword());  // DEBUG

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public ResponseEntity<List<User>> getUsers()
    {
        return ResponseEntity.ok(userRepository.findAll());

    }

    public ResponseEntity<User> getUserById(int id) {
        // findById returns an Optional<User> because the ID might not exist
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user)) // If found, return 200 OK + User
                .orElseGet(() -> ResponseEntity.notFound().build()); // If not found, return 404
    }


    public String login(String email, String password) {
        System.out.println("EMAIL: " + email);
        System.out.println("PASSWORD: " + password);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );

        return jwtService.generateToken(email);
    }
}
