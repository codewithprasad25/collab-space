package com.example.collab_space.service;

import com.example.collab_space.enums.Role;
import com.example.collab_space.model.User;
import com.example.collab_space.model.Workspace;
import com.example.collab_space.model.WorkspaceMember;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.repository.WorkspaceMemberRepo;
import com.example.collab_space.repository.WorkspaceRepo;
import com.example.collab_space.requestDto.InviteUserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkspaceService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    WorkspaceMemberRepo workspaceMemberRepo;

    @Autowired
    WorkspaceRepo workspaceRepo;

    @Autowired
    MailService mailService;

    public void createWorkspace(String workspaceName, String loggedInEmail) {
        User user = userRepository.findByEmail(loggedInEmail);

        if(user == null){
            throw new RuntimeException("User not found");
        }

        if (!user.isActive()){
            throw new RuntimeException("Inactive account");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByUser(user);

        for(WorkspaceMember workspace : list){
            if(workspace.getWorkspace().getName().equals(workspaceName)){
                if(workspace.getRole().equals(Role.Owner)){
                    throw new RuntimeException("You already created workspace with this name");
                }
            }
        }
        Workspace workspace = new Workspace();
        workspace.setName(workspaceName);
        workspaceRepo.save(workspace);

        WorkspaceMember workspaceMember = new WorkspaceMember();
        workspaceMember.setWorkspace(workspace);
        workspaceMember.setUser(user);
        workspaceMember.setRole(Role.Owner);
        workspaceMemberRepo.save(workspaceMember);


    }

    public void inviteUser(Long workspaceId, InviteUserDto inviteUserDto) {
        User user = userRepository.findByEmail(inviteUserDto.getAdminEmail());
        Optional<Workspace> workspace = workspaceRepo.findById(workspaceId);  //findbyid gives us optional object bcz ans would be null so catch in optional - findbyid gives us optional in default - optional is object


        if(user == null || workspace.isEmpty()){
            throw new RuntimeException("User not found or workspace does not exists");
        }

        if (!user.isActive()){
            throw new RuntimeException("Inactive account");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByUser(user);
        for(WorkspaceMember workspaceMember : list){
            if(workspaceMember.getWorkspace().getName().equals(workspace.get().getName())){
                if((!workspaceMember.getRole().equals(Role.Owner)) && (!workspaceMember.getRole().equals(Role.Admin))){
                    throw new RuntimeException("You are not allowed to invite anyone");
                }
            }
        }

        User invitedUser = userRepository.findByEmail(inviteUserDto.getUserEmail());


        if()


        mailService.inviteUser(user,workspace.get(),inviteUserDto.getUserEmail());


    }

    //user can already exists in the workspace with the inviting email
    //user already exists kar sakta hai app mein
    //New user will be invited
    //Invite page needed
}
