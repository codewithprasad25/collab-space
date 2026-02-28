package com.example.collab_space.responseDto;

import lombok.Data;

@Data
public class WorkspaceMemberDto {
    Long userId;
    String userName;
    String userEmail;
    boolean isActive;
}
