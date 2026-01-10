package com.example.collab_space.repository;

import com.example.collab_space.model.Otp;
import com.example.collab_space.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface OtpRepository extends JpaRepository<Otp,Long> {
    Otp findByUser(User user);
}
