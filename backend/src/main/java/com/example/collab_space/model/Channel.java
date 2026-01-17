package com.example.collab_space.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "channel")
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    Workspace workspace;

    @Column(nullable = false)
    String name;

    @CreationTimestamp
    LocalDate createdAt;

    @CreationTimestamp
    LocalDate updateAt;

}
