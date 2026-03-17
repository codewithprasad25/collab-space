package com.example.collab_space.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<ExceptionResponse> handleUserNotFound(UserNotFound ex){
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setMessage(ex.getMessage());
        exceptionResponse.setStatus(404);
        exceptionResponse.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotVerified.class)
    public ResponseEntity<ExceptionResponse> handleUserNotFound(UserNotVerified ex){
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setMessage(ex.getMessage());
        exceptionResponse.setStatus(401);
        exceptionResponse.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExist.class)
    public ResponseEntity<ExceptionResponse> handleUserNotFound(UserAlreadyExist ex){
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setMessage(ex.getMessage());
        exceptionResponse.setStatus(409); //409 tells us conflict
        exceptionResponse.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }
}
