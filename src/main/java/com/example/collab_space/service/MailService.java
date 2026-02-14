package com.example.collab_space.service;

import com.example.collab_space.model.User;
import com.example.collab_space.model.Workspace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;


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

//    public void inviteUser(User user, Workspace workspace, String userEmail) {
//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setTo(userEmail);
//        mailMessage.setSubject("Invite Email");
//        mailMessage.setText();
//    }

    public void inviteExistingUser(User user, Workspace workspace, String userEmail, UUID inviteToken) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userEmail);
        mailMessage.setSubject("Invite Email");
        mailMessage.setText("http://127.0.0.1:5502/accept.html?token="+inviteToken);
        mailSender.send(mailMessage);
    }

    public void inviteNonExistingUser(User user, Workspace workspace, String userEmail, UUID inviteToken) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(userEmail);
        mailMessage.setSubject("Invite Email");
        mailMessage.setText("http://127.0.0.1:5502/signup.html?token="+inviteToken);
        mailSender.send(mailMessage);
    }
}
