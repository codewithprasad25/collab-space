package com.example.collab_space.service;

import com.example.collab_space.model.*;
import com.example.collab_space.repository.*;
import com.example.collab_space.requestDto.ChannelCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ChannelService {

    @Autowired
    WorkspaceRepo workspaceRepo;

    @Autowired
    ChannelRepo channelRepo;

    @Autowired
    UserRepository userRepository;

    @Autowired
    WorkspaceMemberRepo workspaceMemberRepo;

    @Autowired
    ChannelMemberRepo channelMemberRepo;

    public void createChannel(Long userId, ChannelCreationDto channelCreationDto) {
        Optional<Workspace> workspace = workspaceRepo.findById(channelCreationDto.getWorkspaceId());  //find by id return optional object defaultly
        //optional means one empty box in that workspace will present or not to be present

        if (workspace.isEmpty()) {  //this workspace variable is not of Workspace type its Optional type
            throw new RuntimeException("Workspace does not exists");
        }
        Channel channel1 = channelRepo.findByName(channelCreationDto.getChannelName().toLowerCase());

        if(channel1 != null){
            throw new RuntimeException("Channel with this name already exists");
        }

        Optional <User> user = userRepository.findById(userId);
        if(user.isEmpty()){
            throw new RuntimeException("User does not exists");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByWorkspace(workspace.get());
        boolean isMember = false;
        for(WorkspaceMember workspaceMember : list){
            if(workspaceMember.getUser() == user.get()){
                isMember = true;
                break;
            }
        }

        if(!isMember){
            throw new RuntimeException("User is not in our workspace");
        }

        Channel channel = new Channel();
        channel.setName(channelCreationDto.getChannelName().toLowerCase());
        channel.setPrivate(Boolean.parseBoolean(channelCreationDto.getIsPrivate().toLowerCase()));
        channel.setWorkspace(workspace.get());
        channel.setCreatedAt(LocalDate.now());
        channel.setUpdateAt(LocalDate.now());
        channelRepo.save(channel);

        if(Boolean.parseBoolean(channelCreationDto.getIsPrivate())){
            ChannelMember channelMember = new ChannelMember();
            channelMember.setChannel(channel);
            channelMember.setUser(user.get());
            channelMember.setJoinedAt(LocalDate.now());
            channelMemberRepo.save(channelMember);
        }else {

            for (WorkspaceMember workspaceMember : list) {
                ChannelMember channelMember = new ChannelMember();
                channelMember.setUser(workspaceMember.getUser());
                channelMember.setChannel(channel);
                channelMember.setJoinedAt(LocalDate.now());
                channelMemberRepo.save(channelMember);
            }
        }

    }
}