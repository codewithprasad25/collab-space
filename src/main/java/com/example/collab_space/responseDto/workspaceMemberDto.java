package com.example.collab_space.responseDto;

import lombok.Data;

@Data
public class workspaceMemberDto {
    Long userId;
    String userName;
    boolean isActive;
}
