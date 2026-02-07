package com.example.collab_space.repository;

import com.example.collab_space.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
}
