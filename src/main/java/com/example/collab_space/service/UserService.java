package com.example.collab_space.service;

import com.example.collab_space.model.Otp;
import com.example.collab_space.model.User;
import com.example.collab_space.repository.OtpRepository;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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

        if(user1!=null && !user1.isActive()){   //if user is present but not active means didnt do verification otp so its below method will run
            otp = otpService.renewOtp(user1);
            mailService.sendOtp(user1.getEmail(),otp.getOtp());
        }

        else { //else create new user and set him inactive save in user repository generate otp and save that otp in DB and send it via email.
            User user = new User();   //user is primary key here
            user.setActive(false);
            user.setName(registrationDto.getName());
            user.setEmail(registrationDto.getEmail());
            user.setPassword(registrationDto.getPassword());
            userRepository.save(user);
            otp = otpService.generateOtp(user);
            otpRepository.save(otp);
            mailService.sendOtp(user.getEmail(),otp.getOtp());
        }
    }


    public void userLoginWithEmailAndPass(UserLoginDto loginDto){

        if(loginDto == null){
            throw new RuntimeException("Login data missing");
        }

        if(loginDto.getEmail() == null || loginDto.getEmail().trim().isEmpty()){
            throw new RuntimeException("credentials are required");
        }

        if(loginDto.getPassword() == null || loginDto.getPassword().trim().isEmpty()){
            throw new RuntimeException("credentials are required");
        }

        User user = userRepository.findByEmail(loginDto.getEmail());

        if(user == null){
            throw new RuntimeException("User not found");
        }

        if(!user.getPassword().equals(loginDto.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }

        if(!user.isActive()){
            throw new RuntimeException("User not verified, please register yourself again");
        }

        // success → return silently
    }


    public void userLoginWithOtp(String email) {
        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new RuntimeException("User not found");
        }

        if(!user.isActive()){
            throw new RuntimeException("User not verified, please register yourself again");
        }
        Otp otp = otpService.renewOtp(user);
        mailService.sendOtp(email,otp.getOtp());
    }
}
