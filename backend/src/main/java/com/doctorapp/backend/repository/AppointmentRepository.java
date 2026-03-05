package com.doctorapp.backend.repository;

import com.doctorapp.backend.entity.Appointment;
import com.doctorapp.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByDoctorAndAppointmentDate(
            Doctor doctor,
            LocalDate appointmentDate
    );

    boolean existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
            Integer doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime
    );
    List<Appointment> findByUser_UserId(Integer userId);

}