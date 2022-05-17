package com.example.dits.service;

import com.example.dits.entity.User;

public interface UserService {
    User getUserByLogin(String login);
}
