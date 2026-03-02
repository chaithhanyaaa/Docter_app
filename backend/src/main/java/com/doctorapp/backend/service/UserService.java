package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.exception.DuplicateEmailException;
import com.doctorapp.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{
    final  private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(User user) {

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
}
