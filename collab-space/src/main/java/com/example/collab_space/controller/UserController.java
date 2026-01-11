package com.example.collab_space.controller;

import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import com.example.collab_space.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public void userRegistration(@RequestBody UserRegistrationDto registrationDto){
        userService.userRegistration(registrationDto);
    }

    @PostMapping("/login")
    public void userLogin(@RequestBody UserLoginDto loginDto){
        userService.userLogin(loginDto);
    }
}
