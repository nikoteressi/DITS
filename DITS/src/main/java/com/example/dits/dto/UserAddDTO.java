package com.example.dits.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddDTO {
    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private String login;
    private String password;
    private RoleDTO role;

}
