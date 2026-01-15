package com.example.collab_space.controller;

import com.example.collab_space.requestDto.OtpVerificationDto;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import com.example.collab_space.service.OtpService;
import com.example.collab_space.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> otpVerification(@RequestBody OtpVerificationDto verificationDto) {
        try {
            if(otpService.verify(verificationDto))
                return new ResponseEntity<>("Otp is Verified", HttpStatus.OK);
        }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
        return null;
    }

    @PostMapping("/login")
    public ResponseEntity<String> userLogin(@RequestBody UserLoginDto loginDto){
        try {
            userService.userLogin(loginDto);
            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
