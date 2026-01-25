package com.example.collab_space.service;

import com.example.collab_space.model.User;
import com.example.collab_space.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkspaceService {

    @Autowired
    UserRepository userRepository;

    public void createWorkspace(String workspaceName, String loggedInEmail) {
        User user = userRepository.findByEmail(loggedInEmail);

        if(user == null){
            throw new RuntimeException("User not found");
        }

        if (!user.isActive()){
            throw new RuntimeException("Inactive account");
        }


    }
}
