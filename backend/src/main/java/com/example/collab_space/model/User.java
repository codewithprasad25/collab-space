package com.example.collab_space.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long userId;

    @Column(nullable = false)
    String name;

    @Column(nullable = false,unique = true)
    String email;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    boolean isActive;

    @CreationTimestamp
    LocalDate createdAt;
}
