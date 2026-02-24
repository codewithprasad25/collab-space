package com.example.collab_space.service;

import com.example.collab_space.model.*;
import com.example.collab_space.repository.*;
import com.example.collab_space.requestDto.AddChannelMemberDto;
import com.example.collab_space.requestDto.ChannelCreationDto;
import com.example.collab_space.requestDto.UserChannelReqDto;
import com.example.collab_space.responseDto.ChannelResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
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

    public void addChannelMember(Long userId, AddChannelMemberDto channelMemberDto) {
        Optional<Workspace> workspace = workspaceRepo.findById(channelMemberDto.getWorkspaceId());  //find by id return optional object defaultly
        //optional means one empty box in that workspace will present or not to be present

        if (workspace.isEmpty()) {  //this workspace variable is not of Workspace type its Optional type
            throw new RuntimeException("Workspace does not exists");
        }
        Optional<Channel> channel1 = channelRepo.findById(channelMemberDto.getChannelId());

        if (channel1.isEmpty()) {
            throw new RuntimeException("Channel does not exists");
        }

        Optional<User> user = userRepository.findById(userId);
        Optional<User> member = userRepository.findById(channelMemberDto.getMemberId());
        if (user.isEmpty() || member.isEmpty()) {
            throw new RuntimeException("User does not exists");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByWorkspace(workspace.get());
        boolean isUserExists = false;
        boolean isMemberExists = false;

        for (WorkspaceMember workspaceMember : list) {
            if (isMemberExists && isUserExists) {
                break;
            }

            if (workspaceMember.getUser() == user.get()) {
                isUserExists = true;
            } else if (workspaceMember.getUser() == member.get()) {
                isMemberExists = true;
            }
        }

        if (!isMemberExists || !isUserExists) {
            throw new RuntimeException("User is not in our workspace");
        }

        isUserExists = false;
        isMemberExists = false;

        List<ChannelMember> channelMembers = channelMemberRepo.findByChannel(channel1.get());

        for (ChannelMember cm : channelMembers) {
            if (isMemberExists && isUserExists) {
                break;
            }
            if (cm.getUser() == user.get()) {
                isUserExists = true;
            } else if (cm.getUser() == member.get()) {
                isMemberExists = true;

            }
        }

        if (isMemberExists) {
            throw new RuntimeException("User already in the channel");
        } else if (!isUserExists) {
            throw new RuntimeException("Invalid invitation");
        } else {
            ChannelMember channelMember = new ChannelMember();
            channelMember.setChannel(channel1.get());
            channelMember.setUser(member.get());
            channelMember.setJoinedAt(LocalDate.now());
            channelMemberRepo.save(channelMember);
        }
    }

    public List<ChannelResponseDto> fetchUserChannel(UserChannelReqDto reqDto) {
        Optional<Workspace> workspace = workspaceRepo.findById(reqDto.getWorkspaceId());  //find by id return optional object defaultly
        //optional means one empty box in that workspace will present or not to be present


        User user = userRepository.findByEmail(reqDto.getUserEmail());
        if (user == null || user.isActive()) {
            throw new RuntimeException("User does not exists or inactive account");
        }

        if (workspace.isEmpty()) {  //this workspace variable is not of Workspace type its Optional type
            throw new RuntimeException("Workspace does not exists");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByWorkspace(workspace.get());
        boolean isUserExists = false;

        for (WorkspaceMember workspaceMember : list) {
            if(workspaceMember.getUser() == user){
                isUserExists = true;
                break;
            }
        }
        if(!isUserExists){
            throw new RuntimeException("User is not in our workspace");
        }

        List<Channel> channels = channelRepo.findByWorkspace(workspace.get());
        List<ChannelResponseDto> responseDtos = new ArrayList<>();

        for(Channel channel : channels){
            List<ChannelMember> channelMembers = channelMemberRepo.findByChannel(channel);
            for(ChannelMember member : channelMembers){
                if(member.getUser() == user){
                    ChannelResponseDto responseDto = new ChannelResponseDto();
                    responseDto.setChannelId(channel.getId());
                    responseDto.setChannelName(channel.getName());
                    responseDto.setPrivate(channel.isPrivate());
                    responseDtos.add(responseDto);
                }
            }
        }
        return responseDtos;
    }

}
