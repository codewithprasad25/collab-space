package com.example.collab_space.controller;

import com.example.collab_space.requestDto.OtpVerificationDto;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import com.example.collab_space.service.OtpService;
import com.example.collab_space.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    OtpService otpService;

    @PostMapping("/register")
    public void userRegistration(@RequestBody UserRegistrationDto registrationDto){
        userService.userRegistration(registrationDto);
    }

    @PutMapping("/otp/verify")
    public void otpVerification(@RequestBody OtpVerificationDto verificationDto) {
        otpService.verify(verificationDto);
    }

    @PostMapping("/login")
    public void userLogin(@RequestBody UserLoginDto loginDto){
        userService.userLogin(loginDto);
    }
}
