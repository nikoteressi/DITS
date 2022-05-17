package com.example.dits.controllers;

import com.example.dits.dto.TestStatisticByUser;
import com.example.dits.entity.User;
import com.example.dits.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserStatisticController {
    private final StatisticService statisticService;

    @GetMapping("/personal-statistic")
    public String personalStatistic(ModelMap model, HttpSession session) {
        List<TestStatisticByUser> testStatistic = statisticService.getListOfTestsWithStatisticsByUser((User) session.getAttribute("user"));
        model.addAttribute("title", "Personal Statistic");
        model.addAttribute("testStatisticsByUser", testStatistic);
        return "/user/personal-statistic";
    }
}
