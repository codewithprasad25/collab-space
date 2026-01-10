package com.example.collab_space.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    User sender;

    @ManyToOne
    Channel channel;

    @ManyToOne
    Conversation conversation;

    @Column(nullable = false)
    String message;

    @CreationTimestamp
    LocalDate sentAt;
}
