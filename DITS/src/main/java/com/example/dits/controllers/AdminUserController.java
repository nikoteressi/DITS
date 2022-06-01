package com.example.dits.controllers;

import com.example.dits.dto.UserInfoDTO;
import com.example.dits.entity.Role;
import com.example.dits.entity.User;
import com.example.dits.service.RoleService;
import com.example.dits.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminUserController {
    private final UserService userService;
    private final RoleService roleService;
    private final ModelMapper modelMapper;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AdminUserController(UserService userService, RoleService roleService, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users-list")
    public String getUsers(ModelMap model, HttpSession session) {
        session.setAttribute("user", userService.getUserByLogin(getPrincipal()));
        model.addAttribute("title", "User editor");
        return "admin/users-editor";
    }

    private static String getPrincipal() {
        String userName;
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else
            userName = principal.toString();
        return userName;
    }

    @ResponseBody
    @DeleteMapping("/remove-user")
    public List<UserInfoDTO> removeUser(@RequestParam int userId) {
        userService.removeUser(userId);
        return getUsersList();
    }

    @ResponseBody
    @PostMapping("/add-user")
    public List<UserInfoDTO> adduser(@RequestBody UserInfoDTO userInfo) {
        User user = modelMapper.map(userInfo, User.class);
        Role role = roleService.getRoleByRoleName(userInfo.getRole());
        String password = passwordEncoder.encode(userInfo.getPassword());
        user.setRole(role);
        user.setPassword(password);
        userService.save(user);
        return getUsersList();
    }

    @PostMapping("/edit-user")
    public String editUser(@RequestBody UserInfoDTO userInfo) {
        User user = modelMapper.map(userInfo, User.class);
        int userId = userInfo.getUserId();
        String password = passwordEncoder.encode(userInfo.getPassword());
        Role role = roleService.getRoleByRoleName(userInfo.getRole());
        user.setRole(role);
        user.setPassword(password);
        userService.update(user, userId);
        return "redirect:/admin/get-users";
    }

    @ResponseBody
    @GetMapping("/get-users")
    private List<UserInfoDTO> getUsersList() {
        List<User> users = userService.getAllUsers();
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @ResponseBody
    @GetMapping("/get-user-by-id")
    private UserInfoDTO getUserById(@RequestParam int userId) {
        User user = userService.getUserById(userId);
        return convertToDTO(user);
    }
    private UserInfoDTO convertToDTO(User user) {
        return modelMapper.map(user, UserInfoDTO.class);
    }
}

