package com.doctorapp.backend.repository;

import com.doctorapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer>
{
    public boolean existsByEmail(String email);
}