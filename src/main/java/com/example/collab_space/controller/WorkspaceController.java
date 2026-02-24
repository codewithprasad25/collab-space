package com.example.collab_space.controller;


import com.example.collab_space.requestDto.InviteUserDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import com.example.collab_space.responseDto.WorkspaceResponseDto;
import com.example.collab_space.service.WorkspaceService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class WorkspaceController {

    @Autowired
    WorkspaceService workspaceService;

    @PostMapping("/create/workspace/{workspaceName}")
    public ResponseEntity<@NonNull String> createWorkspace(@PathVariable String workspaceName,
                                                           @RequestParam String loggedInEmail) {
        try {
            workspaceService.createWorkspace(workspaceName, loggedInEmail);
            return new ResponseEntity<>("workspace created", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/invite/workspace/{workspaceId}")
    public ResponseEntity<@NonNull String> inviteUserInWorkspace(@PathVariable Long workspaceId,
                                                                 @RequestBody InviteUserDto inviteUserDto) {
        try {
            workspaceService.inviteUser(workspaceId, inviteUserDto);
            return new ResponseEntity<>("User invited successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/accept/invite/{invitedToken}")
    public ResponseEntity acceptInvite(@PathVariable String invitedToken) {
        try {
            workspaceService.acceptInvite(invitedToken);
            return new ResponseEntity("Invitation accepted", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("fetch/invited/email/{invitedToken}")
    public ResponseEntity fetchUserEmail(@PathVariable String invitedToken) {
        try {
            String userEmail = workspaceService.fetchUserEmail(invitedToken);
            return new ResponseEntity(userEmail, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register/invited/user/{inviteToken}")
    public ResponseEntity registerInvitedUser(@RequestBody UserRegistrationDto registrationDto,
                                              @PathVariable String inviteToken) {
        try {
            workspaceService.registerInvitedUser(inviteToken, registrationDto);
            return new ResponseEntity("Invitation accepted", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/fetch/users/workspace/{userEmail}")
    public ResponseEntity fetchWorkspace(@PathVariable String userEmail){
        try{
        List<WorkspaceResponseDto> list = workspaceService.fetchUserWorkspace(userEmail);
        return new ResponseEntity(list,HttpStatus.OK);
    }catch(RuntimeException e){
            return new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}