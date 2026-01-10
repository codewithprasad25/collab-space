package com.example.collab_space.model;

import com.example.collab_space.Enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "workspaceMember")
public class WorkspaceMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne //child entities always use manytoone relation bcz it depends on workspace and user and they both are main parent entity
    Workspace workspace;

    @ManyToOne
    User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    Role role;

    @CreationTimestamp
    LocalDate joinedAt;
}
