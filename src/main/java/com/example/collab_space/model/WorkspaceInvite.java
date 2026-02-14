package com.example.collab_space.model;

import com.example.collab_space.enums.InviteStatus;
import com.example.collab_space.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "workspaceInvite")
public class WorkspaceInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    Workspace workspace;  // we take here only object of workspace, not take object of user bcz in DB user may or may not present hence we only make email field in this entity bcz if user preasent or not be present email always exists.

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    Role userRole;

    @Column(nullable = false)
    LocalDateTime invitedAt;

    @Column(nullable = false)
    LocalDateTime expiresAt;

    @Column(nullable = false)
    UUID inviteToken;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    InviteStatus inviteStatus;

}
