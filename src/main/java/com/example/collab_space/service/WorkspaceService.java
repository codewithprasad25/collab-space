package com.example.collab_space.service;

import com.example.collab_space.enums.Role;
import com.example.collab_space.model.User;
import com.example.collab_space.model.Workspace;
import com.example.collab_space.model.WorkspaceMember;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.repository.WorkspaceMemberRepo;
import com.example.collab_space.repository.WorkspaceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkspaceService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    WorkspaceMemberRepo workspaceMemberRepo;

    @Autowired
    WorkspaceRepo workspaceRepo;

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
                if(workspace.getRole().equals(Role.Admin)){
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
        workspaceMember.setRole(Role.Admin);
        workspaceMemberRepo.save(workspaceMember);


    }
}
