package com.example.dits.service.impl;

import com.example.dits.DAO.UserRepository;
import com.example.dits.entity.User;
import com.example.dits.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;

    @Autowired
    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public void create(User user) {
        repository.save(user);
    }

    @Override
    @Transactional
    public void update(User user, int id) {
        User userFromDb = repository.findUserByUserId(id);
        userFromDb.setFirstName(user.getFirstName());
        userFromDb.setLastName(user.getLastName());
        userFromDb.setRole(user.getRole());
        userFromDb.setLogin(user.getLogin());
        userFromDb.setPassword(user.getPassword());
        repository.save(userFromDb);
    }



    @Override
    @Transactional
    public void save(User user) {
        repository.save(user);
    }

    @Transactional
    public User getUserByLogin(String login){
        return repository.getUserByLogin(login);
    }

    @Override
    public List<User> getAllUsers() {
        return repository.findAll();
    }
    @Transactional
    public void removeUser(int userId) {
        repository.deleteById(userId);
    }

    @Override
    public User getUserById(int userId) {
        return repository.findUserByUserId(userId);
    }

}
