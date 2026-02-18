package com.example.collab_space.repository;

import com.example.collab_space.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelRepo extends JpaRepository<Channel,Long> {
    Channel findByName(String name);
}
