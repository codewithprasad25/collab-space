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
        User user1 = userRepository.findByEmail(registrationDto.getEmail());

        if(user1 != null && user1.isActive()){ //if user is preasent and is active so then throw runtime exception;
           throw new RuntimeException("User With this email already exists");
        }

        Otp otp = null;

        if(user1!=null && !user1.isActive()){   //if user is preasent but not active means didnt do verification otp so its below method will run
            otp =  otpService.generateOtp(user1);
            otpRepository.save(otp);
            mailService.registrationOtp(user1.getEmail(),otp.getOtp());
        }

        else { //else create new user and set him inactive save in userepo generate otp and save that otp in DB and send it via email.
            User user = new User();   //user is primary key here
            user.setActive(false);
            user.setName(registrationDto.getName());
            user.setEmail(registrationDto.getEmail());
            user.setPassword(registrationDto.getPassword());
            userRepository.save(user);
            otp = otpService.generateOtp(user);
            otpRepository.save(otp);
            mailService.registrationOtp(user.getEmail(),otp.getOtp());
        }
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
