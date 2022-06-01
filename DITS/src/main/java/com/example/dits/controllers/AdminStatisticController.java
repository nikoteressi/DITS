package com.example.dits.controllers;

import com.example.dits.dto.*;
import com.example.dits.entity.Topic;
import com.example.dits.entity.User;
import com.example.dits.service.TopicService;
import com.example.dits.service.UserService;
import com.example.dits.service.impl.StatisticServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminStatisticController {

    private final ModelMapper modelMapper;
    private final StatisticServiceImpl statisticService;
    private final TopicService topicService;
    private final UserService userService;

    @GetMapping("/adminStatistic")
    public String testStatistic(ModelMap model){

        List<TopicDTO> topicDTOList = topicService.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
        model.addAttribute("topicList",topicDTOList);
        model.addAttribute("title","Statistic");
        return "admin/test-statistic";
    }

    @ResponseBody
    @GetMapping("/getTestsStatistic")
    public List<TestStatistic> getTestsStatistics(@RequestParam int id) {
        return statisticService.getListOfTestsWithStatisticsByTopic(id);
    }

    @GetMapping("/user-statistic")
    public String userStatistic(ModelMap model){
        List<User> users = userService.getAllUsers();
        model.addAttribute("usersList", users);
        model.addAttribute("title", "User statistic");
        return "admin/user-statistic";
    }

    @ResponseBody
    @GetMapping("/get-users-statistic")
    public List<TestStatisticByUser> getUsersStatistics(@RequestParam int id) {
        return statisticService.getListOfTestsWithStatisticsByUserId(id);
    }

    @ResponseBody
    @GetMapping("/adminStatistic/removeStatistic/byId")
    public String removeStatisticByUserId(@RequestParam int id){
        statisticService.removeStatisticByUserId(id);
        return "success";
    }

    @GetMapping("/adminStatistic/removeStatistic/all")
    public String removeAllStatistic(){
        statisticService.deleteAll();
        return "redirect:/admin/adminStatistic";
    }

    private TopicDTO convertToDTO(Topic topic){
        return modelMapper.map(topic, TopicDTO.class);
    }

}
