package com.example.collab_space.service;

import com.example.collab_space.model.User;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.requestDto.UserLoginDto;
import com.example.collab_space.requestDto.UserRegistrationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public void userRegistration(UserRegistrationDto registrationDto){
        User user = new User();
        user.setActive(false);
        user.setName(registrationDto.getName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword());

        userRepository.save(user);

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
