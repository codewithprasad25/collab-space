package com.example.collab_space.controller;

import com.example.collab_space.model.ChannelMember;
import com.example.collab_space.requestDto.MessageDto;
import com.example.collab_space.service.ChannelService;
import com.example.collab_space.service.MessageService;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;

@Controller
public class MessageController {

    @Autowired
    ChannelService channelService;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    MessageService messageService;


    @MessageMapping("/hello")

    public void send(MessageDto messageDto, Principal principal){
        System.out.println(messageDto.getChannelId());
        System.out.println(messageDto.getMessage());
        System.out.println(principal.getName());

        messageService.saveChannelMessage(messageDto, principal.getName());

        //we will recieve channelid here
        //then we will find all the channel members
        List<ChannelMember> channelMembers = channelService.getChannelMember(Long.parseLong(messageDto.getChannelId()));
        //then we will send message to only those channel member
        for(ChannelMember channelmember : channelMembers){
            simpMessagingTemplate.convertAndSendToUser(
                    channelmember.getUser().getEmail(),  //send email to this user
                    "/topic/messages",  // /user/{userName}/topic/message
                    messageDto
            );
        }


    }
}
