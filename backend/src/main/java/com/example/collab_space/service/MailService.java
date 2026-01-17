package com.example.collab_space.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    JavaMailSender mailSender;

    public void sendOtp(String email, Integer otp){   //this method will take email and send otp on that email
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("Otp Verification");
        mailMessage.setText(String.valueOf(otp));

        mailSender.send(mailMessage);
    }
}
