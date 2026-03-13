package com.example.collab_space.service;

import com.example.collab_space.model.Channel;
import com.example.collab_space.model.Message;
import com.example.collab_space.model.User;
import com.example.collab_space.repository.ChannelRepo;
import com.example.collab_space.repository.MessageRepository;
import com.example.collab_space.repository.UserRepository;
import com.example.collab_space.requestDto.MessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    ChannelRepo channelRepo;

    @Autowired
    UserRepository userRepository;

    public void saveChannelMessage(MessageDto messageDto,String sender){
        Optional<Channel> channel = channelRepo.findById(Long.parseLong(messageDto.getChannelId()));
        User user = userRepository.findByEmail(sender);

        Message message = new Message();
        message.setMessage(messageDto.getMessage());
        message.setSender(user);
        message.setSentAt(LocalDate.now());
        message.setChannel(channel.get());
        message.setConversation(null);

        messageRepository.save(message);

    }

}
