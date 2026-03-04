package com.example.collab_space.controller;

import com.example.collab_space.model.ChannelMember;
import com.example.collab_space.requestDto.MessageDto;
import com.example.collab_space.service.ChannelService;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class MessageController {

    @Autowired
    ChannelService channelService;

    @MessageMapping("/hello")
    @SendTo("/topic/message")
    public MessageDto send(MessageDto messageDto){
        System.out.println(messageDto.getChannelId());
        System.out.println(messageDto.getMessage());
        //we will recieve channelid here
        //then we will find all the channel mambers
        List<ChannelMember> channelmember = channelService.getChannelMember(Long.parseLong(messageDto.getChannelId()));
        //then we will send message to only those channel member

        return messageDto;
    }
}
