package com.example.collab_space.controller;

import com.example.collab_space.requestDto.AddChannelMemberDto;
import com.example.collab_space.requestDto.ChannelCreationDto;
import com.example.collab_space.requestDto.UserChannelReqDto;
import com.example.collab_space.responseDto.ChannelResponseDto;
import com.example.collab_space.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/channel")
public class ChannelController {

    @Autowired
    ChannelService channelService;

    @PostMapping("/create/{userId}")
    public ResponseEntity createChannel(@RequestBody ChannelCreationDto channelCreationDto,
                                        @PathVariable Long userId) {
        try {
            channelService.createChannel(userId,channelCreationDto);
            return new ResponseEntity("Channel created successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/add/channel/member/{userId}")
    public ResponseEntity addChannelMember(@RequestBody AddChannelMemberDto channelMemberDto,
                                           @PathVariable Long userId){
        try{
            channelService.addChannelMember(userId,channelMemberDto);
            return new ResponseEntity("Member added in channel",HttpStatus.OK);
        }catch(RuntimeException e){
            return new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/fetch/users/channels")
    public ResponseEntity fetchChannel(@RequestBody UserChannelReqDto reqDto){
        try{
        List<ChannelResponseDto> list =  channelService.fetchUserChannel(reqDto);
        return new ResponseEntity(list,HttpStatus.OK);
    }catch (RuntimeException e){
            return new ResponseEntity(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
