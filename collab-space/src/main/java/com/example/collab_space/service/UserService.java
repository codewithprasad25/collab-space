package com.example.collab_space.service;

import com.example.collab_space.model.Otp;
import com.example.collab_space.model.User;
import com.example.collab_space.repository.OtpRepository;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    OtpService otpService;

    @Autowired
    MailService mailService;

    public void userRegistration(UserRegistrationDto registrationDto){
        User user = new User();   //user is primary key here
        user.setActive(false);
        user.setName(registrationDto.getName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword());

        userRepository.save(user);

        Otp otp = new Otp();
        otp.setUser(user);   //user will foreign key on otp table
        otp.setCreationTime(LocalTime.now());
        otp.setExpiryTime(LocalTime.now().plusMinutes(5));
        otp.setOtp(otpService.createOtp());   //new otp generated randomly and its value set in bet origin and bound

        otpRepository.save(otp);

        mailService.registrationOtp(user.getEmail(),otp.getOtp());
    }

    public void userLogin(UserLoginDto loginDto){
        User user = userRepository.findByEmail(loginDto.getEmail());

        if(user == null){
            System.out.println("User not found");
            return;
        }

        if(!user.getPassword().equals(loginDto.getPassword())){
            System.out.println("Wrong password");
            return;
        }

        System.out.println("Login successful");


    }
}
