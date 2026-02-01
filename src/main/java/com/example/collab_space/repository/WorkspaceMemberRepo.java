package com.example.collab_space.repository;

import com.example.collab_space.model.User;
import com.example.collab_space.model.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceMemberRepo extends JpaRepository<WorkspaceMember, Long> {

    List<WorkspaceMember> findByUser(User user);
}
