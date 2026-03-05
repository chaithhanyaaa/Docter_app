package com.doctorapp.backend.controller;

import com.doctorapp.backend.entity.Doctor;
import com.doctorapp.backend.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/doctors")
@CrossOrigin(origins = "*")

public class AdminDoctorController {

    private final DoctorService doctorService;

    public AdminDoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // GET ALL DOCTORS
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // APPROVE DOCTOR
    @PutMapping("/{doctorId}/approve")
    public Doctor approveDoctor(@PathVariable Integer doctorId) {
        return doctorService.approveDoctor(doctorId);
    }


    @PutMapping("/{doctorId}/disapprove")
    public Doctor disapproveDoctor(@PathVariable Integer doctorId) {

        return doctorService.disapproveDoctor(doctorId);
    }


    @DeleteMapping("/{doctorId}")
    public String deleteDoctor(@PathVariable Integer doctorId) {

        doctorService.deleteDoctor(doctorId);

        return "Doctor deleted successfully";
    }
}