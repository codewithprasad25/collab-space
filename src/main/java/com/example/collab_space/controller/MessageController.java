package com.example.collab_space.controller;

import com.example.collab_space.requestDto.MessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/hello")
    @SendTo("/topic/message")
    public MessageDto send(MessageDto messageDto){
        return messageDto;
    }
}
