package com.example.collab_space.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "channelMember")
public class ChannelMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    Channel channel;

    @ManyToOne
    User user;

    @CreationTimestamp
    LocalDate joinedAt;
}
