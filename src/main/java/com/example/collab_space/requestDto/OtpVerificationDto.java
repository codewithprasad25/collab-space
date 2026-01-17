package com.example.collab_space.requestDto;

import lombok.Data;

@Data
public class OtpVerificationDto {
    String email;
    int otp;
}
