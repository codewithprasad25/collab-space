package com.example.collab_space.responseDto;

import lombok.Data;

@Data
public class ChannelResponseDto {
    Long channelId;
    String channelName;
    boolean isPrivate;
}
