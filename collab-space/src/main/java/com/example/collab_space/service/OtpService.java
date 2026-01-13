package com.example.collab_space.service;

import com.example.collab_space.model.Otp;
import com.example.collab_space.model.User;
import com.example.collab_space.repository.OtpRepository;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.requestDto.OtpVerificationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    OtpRepository otpRepository;

    public Integer createOtp(){
        return new Random().nextInt(100000,999999);
    }

    public Otp generateOtp(User user){
        Otp otp = new Otp();
        otp.setUser(user);   //user will foreign key on otp table
        otp.setCreationTime(LocalDateTime.now());
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otp.setOtp(createOtp());   //new otp generated randomly and its value set in bet origin and bound

        return otp;
    }

    public boolean verify(OtpVerificationDto otpVerificationDto){
        User user = userRepository.findByEmail(otpVerificationDto.getEmail());

        if(user == null){
            throw new RuntimeException("User with this email does not exist");
        }

        Otp otp = otpRepository.findByUser(user);
        if(otp.getOtp() == otpVerificationDto.getOtp()){
            if()
        }
    }
}
