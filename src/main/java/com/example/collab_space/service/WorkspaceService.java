package com.example.collab_space.service;

import com.example.collab_space.enums.InviteStatus;
import com.example.collab_space.enums.Role;
import com.example.collab_space.model.User;
import com.example.collab_space.model.Workspace;
import com.example.collab_space.model.WorkspaceInvite;
import com.example.collab_space.model.WorkspaceMember;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.repository.WorkspaceInviteRepo;
import com.example.collab_space.repository.WorkspaceMemberRepo;
import com.example.collab_space.repository.WorkspaceRepo;
import com.example.collab_space.requestDto.InviteUserDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Autowired
    WorkspaceInviteRepo workspaceInviteRepo;

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
        Optional<Workspace> optionalWorkspace= workspaceRepo.findById(workspaceId);  //findbyid gives us optional object bcz ans would be null so catch in optional - findbyid gives us optional in default - optional is object


        if(user == null || optionalWorkspace.isEmpty()){
            throw new RuntimeException("User not found or workspace does not exists");
        }

        if (!user.isActive()){
            throw new RuntimeException("Inactive account");
        }

        List<WorkspaceMember> list = workspaceMemberRepo.findByUser(user);

        for(WorkspaceMember workspaceMember : list){
            if(workspaceMember.getWorkspace().getName().equals(optionalWorkspace.get().getName())){
                if((!workspaceMember.getRole().equals(Role.Owner)) && (!workspaceMember.getRole().equals(Role.Admin))){
                    throw new RuntimeException("You are not allowed to invite anyone");
                }
            }
        }

        User invitedUser = userRepository.findByEmail(inviteUserDto.getUserEmail());
        WorkspaceInvite workspaceInvite = null;


        if(invitedUser == null) {
            workspaceInvite = new WorkspaceInvite();
            workspaceInvite.setInviteStatus(InviteStatus.Pending);
            workspaceInvite.setInvitedAt(LocalDateTime.now());
            workspaceInvite.setWorkspace(optionalWorkspace.get());  //after using .get() we will get object from optional workspace datatype
            workspaceInvite.setInviteToken(UUID.randomUUID());
            workspaceInvite.setEmail(inviteUserDto.getUserEmail());
            workspaceInvite.setExpiresAt(workspaceInvite.getInvitedAt().plusDays(2));
            workspaceInvite.setUserRole(inviteUserDto.getUserRole());
            workspaceInviteRepo.save(workspaceInvite);
            mailService.inviteNonExistingUser(user,optionalWorkspace.get(),inviteUserDto.getUserEmail(),workspaceInvite.getInviteToken());
        }

        else {
            List<WorkspaceMember> invitedUserWorkspaceList = workspaceMemberRepo.findByUser(invitedUser);

            for (WorkspaceMember workspaceMember : invitedUserWorkspaceList) {
                if (workspaceMember.getWorkspace().getName().equals(optionalWorkspace.get().getName())) {
                    throw new RuntimeException("You are inviting already existing user in your workspace");
                }
            }
            workspaceInvite = new WorkspaceInvite();
            workspaceInvite.setInviteStatus(InviteStatus.Pending);
            workspaceInvite.setInvitedAt(LocalDateTime.now());
            workspaceInvite.setWorkspace(optionalWorkspace.get());  //after using .get() we will get object from optional workspace datatype
            workspaceInvite.setInviteToken(UUID.randomUUID());
            workspaceInvite.setEmail(inviteUserDto.getUserEmail());
            workspaceInvite.setExpiresAt(workspaceInvite.getInvitedAt().plusDays(2));
            workspaceInvite.setUserRole(inviteUserDto.getUserRole());
            workspaceInviteRepo.save(workspaceInvite);

            mailService.inviteExistingUser(user, optionalWorkspace.get(), inviteUserDto.getUserEmail(), workspaceInvite.getInviteToken());
        }

        }

    public void acceptInvite(String invitedToken) {   //which invite create against this invitedToken
        WorkspaceInvite workspaceInvite = workspaceInviteRepo.findByInviteToken(UUID.fromString(invitedToken));  //take workspaceInvite object with the help of token
                                                                                                                    //String type convert to UUID type
        if(workspaceInvite == null){
            throw new RuntimeException("Invalid invitation");
        }

        User user = userRepository.findByEmail(workspaceInvite.getEmail());

        if(user == null){
            throw new RuntimeException("User does not exists");
        }

        if(LocalDateTime.now().isAfter(workspaceInvite.getExpiresAt())){
            throw new RuntimeException("Invitation is expired");
        }

        if(workspaceInvite.getInviteStatus().equals(InviteStatus.Accepted) || workspaceInvite.getInviteStatus().equals(InviteStatus.Rejected)){
            throw new RuntimeException("You already accepted or rejected the invitation");
        }

        workspaceInvite.setInviteStatus(InviteStatus.Accepted);
        workspaceInviteRepo.save(workspaceInvite);

        WorkspaceMember workspaceMember = new WorkspaceMember();
        workspaceMember.setActiveInWorkspace(true);
        workspaceMember.setJoinedAt(LocalDate.now());
        workspaceMember.setRole(workspaceInvite.getUserRole());
        workspaceMember.setUser(user);
        workspaceMember.setWorkspace(workspaceInvite.getWorkspace());
        workspaceMemberRepo.save(workspaceMember);
    }

    public String fetchUserEmail(String invitedToken) {
        WorkspaceInvite workspaceInvite = workspaceInviteRepo.findByInviteToken(UUID.fromString(invitedToken));  //take workspaceInvite object with the help of token
                                                                                                                    // String type convert to UUID type
        if(workspaceInvite == null){
            throw new RuntimeException("Invalid invitation");
        }

        User user = userRepository.findByEmail(workspaceInvite.getEmail());

        if(user != null){
            throw new RuntimeException("User already  exists with this email");
        }

        if(LocalDateTime.now().isAfter(workspaceInvite.getExpiresAt())){
            throw new RuntimeException("Invitation is expired");
        }

        return workspaceInvite.getEmail();
    }

    public void registerInvitedUser(String inviteToken, UserRegistrationDto registrationDto) {
        WorkspaceInvite workspaceInvite = workspaceInviteRepo.findByInviteToken(UUID.fromString(inviteToken));  //take workspaceInvite object with the help of token
                                                                                                                // String type convert to UUID type
        if(workspaceInvite == null){
            throw new RuntimeException("Invalid invitation");
        }

        User user = userRepository.findByEmail(workspaceInvite.getEmail());

        if(user != null){
            throw new RuntimeException("User already  exists with this email");
        }

        if(LocalDateTime.now().isAfter(workspaceInvite.getExpiresAt())){
            throw new RuntimeException("Invitation is expired");
        }

        if(workspaceInvite.getInviteStatus().equals(InviteStatus.Accepted) || workspaceInvite.getInviteStatus().equals(InviteStatus.Rejected)){
            throw new RuntimeException("You already accepted or rejected the invitation");
        }

        User invitedUser = new User();
        invitedUser.setName(registrationDto.getName());
        invitedUser.setEmail(registrationDto.getEmail());
        invitedUser.setPassword(registrationDto.getPassword());
        invitedUser.setCreatedAt(LocalDate.now());
        invitedUser.setActive(true);
        userRepository.save(invitedUser);

        WorkspaceMember workspaceMember = new WorkspaceMember();
        workspaceMember.setWorkspace(workspaceInvite.getWorkspace());
        workspaceMember.setUser(invitedUser);
        workspaceMember.setActiveInWorkspace(true);
        workspaceMember.setRole(workspaceInvite.getUserRole());
        workspaceMember.setJoinedAt(LocalDate.now());
        workspaceMemberRepo.save(workspaceMember);
    }

}


    //user can already exist in the workspace with the inviting email
    //user already exists kar sakta hai app mein
    //New user will be invited
    //Invite page needed
    //Security needed at the end of project

