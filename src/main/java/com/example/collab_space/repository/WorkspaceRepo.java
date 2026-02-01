package com.example.collab_space.repository;

import com.example.collab_space.model.Workspace;
import com.example.collab_space.model.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepo extends JpaRepository<Workspace,Long> {


}
