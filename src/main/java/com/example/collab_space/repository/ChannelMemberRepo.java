package com.example.collab_space.repository;

import com.example.collab_space.model.Channel;
import com.example.collab_space.model.ChannelMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChannelMemberRepo extends JpaRepository<ChannelMember,Long> {
    List<ChannelMember> findByChannel(Channel channel);
}
