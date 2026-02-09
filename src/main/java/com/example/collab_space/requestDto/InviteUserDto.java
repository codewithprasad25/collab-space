package com.example.collab_space.requestDto;

import com.example.collab_space.enums.Role;
import lombok.Data;

@Data
public class InviteUserDto {
    String adminEmail;
    String userEmail;
    Role userRole;
}
