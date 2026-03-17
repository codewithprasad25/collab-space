package com.example.collab_space.controller;

import com.example.collab_space.config.JwtUtil;
import com.example.collab_space.requestDto.OtpVerificationDto;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import com.example.collab_space.service.OtpService;
import com.example.collab_space.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    OtpService otpService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/registration")
    public ResponseEntity userRegistration(@RequestBody UserRegistrationDto registrationDto){
            userService.userRegistration(registrationDto);
            return new ResponseEntity<>("registration successful",HttpStatus.OK);
    }

    @PutMapping("/otp/verify")
    public ResponseEntity<String> otpVerification(@RequestBody OtpVerificationDto verificationDto) {
            if (otpService.verify(verificationDto)) {
                return new ResponseEntity<>("Otp is Verified", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid Otp",HttpStatus.BAD_REQUEST);
            }
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody UserLoginDto loginDto){
            userService.LoginWithEmailAndPass(loginDto);
                //JWT token generate karna haii and have to return to user
                String token = jwtUtil.generateToken(loginDto.getEmail());
                return new ResponseEntity<>(token, HttpStatus.OK);
            }


    @PostMapping("/login/{email}")
    public ResponseEntity userLoginWithOtp(@PathVariable String email){
        userService.LoginWithOtp(email);
        return new ResponseEntity<>("Otp is send to your email",HttpStatus.OK);
        }

    }

