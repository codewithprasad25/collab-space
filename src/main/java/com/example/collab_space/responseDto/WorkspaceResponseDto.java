package com.example.collab_space.responseDto;

import lombok.Data;

@Data
public class WorkspaceResponseDto {
    Long workspaceId;
    String workspaceName;
    String userRole;
}
