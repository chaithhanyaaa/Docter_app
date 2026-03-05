package com.doctorapp.backend.repository;

import com.doctorapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer>
{
    public boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}