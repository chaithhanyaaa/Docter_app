package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.Admin;
import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.entity.User;
import com.doctorapp.backend.repository.AdminRepository;
import com.doctorapp.backend.repository.DoctorRepository;
import com.doctorapp.backend.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            AdminRepository adminRepository) {

        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {



        // check USERS table
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.get().getEmail())
                    .password(user.get().getPassword())
                    .authorities("USER")
                    .build();
        }

        // check DOCTORS table
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        if (doctor.isPresent()) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(doctor.get().getEmail())
                    .password(doctor.get().getPassword())
                    .authorities("DOCTOR")
                    .build();
        }

        // check ADMINS table
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(admin.get().getEmail())
                    .password(admin.get().getPassword())
                    .authorities("ADMIN")
                    .build();
        }
        System.out.println("EMAIL FROM TOKEN = " + email);

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}