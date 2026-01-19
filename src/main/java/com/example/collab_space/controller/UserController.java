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

@CrossOrigin("*")
@RestController
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    OtpService otpService;

    @PostMapping("/registration")
    public ResponseEntity userRegistration(@RequestBody UserRegistrationDto registrationDto){
        try {
            userService.userRegistration(registrationDto);
            return new ResponseEntity<>("registration successful",HttpStatus.OK);
        }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/otp/verify")
    public ResponseEntity<String> otpVerification(@RequestBody OtpVerificationDto verificationDto) {
        try {
            if (otpService.verify(verificationDto)) {
                return new ResponseEntity<>("Otp is Verified", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid Otp",HttpStatus.BAD_REQUEST);
            }
        }catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PostMapping("/login")
    public ResponseEntity userLogin(@RequestBody UserLoginDto loginDto){
        try {
            if (userService.LoginWithEmailAndPass(loginDto)){
                return new ResponseEntity<>("Login successful", HttpStatus.OK);
            }

        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    @PostMapping("/login/{email}")
    public ResponseEntity userLoginWithOtp(@PathVariable String email){
        try{
            userService.LoginWithOtp(email);
            return new ResponseEntity<>("Otp is send to your email",HttpStatus.OK);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }

    }

}
