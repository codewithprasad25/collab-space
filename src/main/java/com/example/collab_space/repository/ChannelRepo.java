package com.example.collab_space.repository;

import com.example.collab_space.model.Channel;
import com.example.collab_space.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelRepo extends JpaRepository<Channel,Long> {
    Channel findByName(String name);

    List<Channel> findByWorkspace(Workspace workspace);
}
