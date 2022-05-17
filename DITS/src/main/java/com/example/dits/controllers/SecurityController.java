package com.example.dits.controllers;

import com.example.dits.entity.Topic;
import com.example.dits.entity.User;
import com.example.dits.service.TopicService;
import com.example.dits.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class SecurityController {

    private final UserService userService;
    private final TopicService topicService;

    @GetMapping("/user/chooseTest")
    public String userPage(HttpSession session,ModelMap model) {
        User user = userService.getUserByLogin(getPrincipal());
        List<Topic> topicList = topicService.findAll();
        List<Topic> topicsWithQuestions = new ArrayList<>();
        for (Topic i:topicList){
            if (i.getTestList().size() != 0){
                topicsWithQuestions.add(i);
            }
        }
          session.setAttribute("user", user);
        model.addAttribute("title","Testing");
        model.addAttribute("topicWithQuestions",topicsWithQuestions);
        return "user/chooseTest";
    }

    @GetMapping("/login")
    public String loginPage(ModelMap model){
        model.addAttribute("title","Login");
        return "login";}

    @GetMapping("/accessDenied")
    public String accessDeniedGet(){
        return "accessDenied";
    }

    @GetMapping("/logout")
    public String logoutPage(HttpServletRequest request, HttpServletResponse response){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth != null)
            new SecurityContextLogoutHandler().logout(request,response,auth);

        return "redirect:/login?logout";
    }

    private static String getPrincipal(){
        String userName;
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        if(principal instanceof UserDetails){
            userName = ((UserDetails) principal).getUsername();
        }
        else
            userName = principal.toString();
        return userName;
    }

}
