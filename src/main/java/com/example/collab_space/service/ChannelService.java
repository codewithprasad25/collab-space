package com.example.collab_space.service;

import com.example.collab_space.model.Channel;
import com.example.collab_space.model.Workspace;
import com.example.collab_space.repository.ChannelRepo;
import com.example.collab_space.repository.WorkspaceRepo;
import com.example.collab_space.requestDto.ChannelCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ChannelService {

    @Autowired
    WorkspaceRepo workspaceRepo;

    @Autowired
    ChannelRepo channelRepo;

    public void createChannel(ChannelCreationDto channelCreationDto) {
        Optional<Workspace> workspace = workspaceRepo.findById(channelCreationDto.getWorkspaceId());  //find by id return optional object defaultly
        //optional means one empty box in that workspace will present or not to be present

        if (workspace.isEmpty()) {  //this workspace variable is not of Workspace type its Optional type
            throw new RuntimeException("Workspace does not exists");
        }
        Channel channel1 = channelRepo.findByName(channelCreationDto.getChannelName().toLowerCase());

        if(channel1 != null){
            throw new RuntimeException("Channel with this name already exists");
        }

        Channel channel = new Channel();
        channel.setName(channelCreationDto.getChannelName().toLowerCase());
        channel.setPrivate(Boolean.parseBoolean(channelCreationDto.getIsPrivate().toLowerCase()));
        channel.setWorkspace(workspace.get());
        channel.setCreatedAt(LocalDate.now());
        channel.setUpdateAt(LocalDate.now());
        channelRepo.save(channel);
    }
}