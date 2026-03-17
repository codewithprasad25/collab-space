package com.example.collab_space.exception;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExceptionResponse {
    String message;
    int status;
    LocalDateTime timeStamp;
}
