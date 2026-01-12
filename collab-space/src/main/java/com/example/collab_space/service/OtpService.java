package com.example.collab_space.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OtpService {

    public Integer createOtp(){
        return new Random().nextInt(100000,999999);
    }
}
