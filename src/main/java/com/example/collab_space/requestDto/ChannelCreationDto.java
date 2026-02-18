package com.example.collab_space.requestDto;

import lombok.Data;

@Data
public class ChannelCreationDto {
    Long workspaceId;
    String channelName;
    String isPrivate;
}
