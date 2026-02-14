package com.example.collab_space.repository;

import com.example.collab_space.model.WorkspaceInvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkspaceInviteRepo extends JpaRepository<WorkspaceInvite, Long> {
    WorkspaceInvite findByInviteToken(UUID invitedToken);
}
