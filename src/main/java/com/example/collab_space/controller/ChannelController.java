package com.example.collab_space.controller;

import com.example.collab_space.requestDto.ChannelCreationDto;
import com.example.collab_space.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/channel")
public class ChannelController {

    @Autowired
    ChannelService channelService;

    @PostMapping("/create")
    public ResponseEntity createChannel(@RequestBody ChannelCreationDto channelCreationDto) {
        try {
            channelService.createChannel(channelCreationDto);
            return new ResponseEntity("Channel created successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
