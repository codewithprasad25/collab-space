package com.example.collab_space.exception;

public class UserNotVerified extends RuntimeException {
    public UserNotVerified(String message) {
        super(message);
    }
}
