package com.example.collab_space.controller;


import com.example.collab_space.requestDto.InviteUserDto;
import com.example.collab_space.service.WorkspaceService;
import lombok.NonNull;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class WorkspaceController {

    @Autowired
    WorkspaceService workspaceService;

    @PostMapping("/create/workspace/{workspaceName}")
    public ResponseEntity<@NonNull String> createWorkspace(@PathVariable String workspaceName,
                                                           @RequestParam String loggedInEmail){
        try {
            workspaceService.createWorkspace(workspaceName, loggedInEmail);
            return new ResponseEntity<>("workspace created", HttpStatus.CREATED);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/invite/workspace/{workspaceId}")
    public ResponseEntity<@NonNull String> inviteUserInWorkspace(@PathVariable Long workspaceId,
                                                                 @RequestBody InviteUserDto inviteUserDto) {
        try {
            workspaceService.inviteUser(workspaceId, inviteUserDto);
            return new ResponseEntity<>("User invited successfully",HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
