package com.example.collab_space.controller;


import com.example.collab_space.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class WorkspaceController {

    @Autowired
    WorkspaceService workspaceService;

    @PostMapping("/create/workspace/{workspaceName}")
    public void createWorkspace(@PathVariable String workspaceName,
                                @RequestParam String loggedInEmail){
        workspaceService.createWorkspace(workspaceName,loggedInEmail);

    }

}
