package com.example.collab_space.requestDto;

import lombok.Data;

@Data
public class AddChannelMemberDto {
    Long workspaceId;
    Long channelId;
    Long memberId;
}
