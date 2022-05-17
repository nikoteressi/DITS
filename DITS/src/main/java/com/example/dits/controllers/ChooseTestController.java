package com.example.dits.controllers;

import com.example.dits.dto.TestInfoDTO;
import com.example.dits.entity.Test;
import com.example.dits.service.TestService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class ChooseTestController {

    private final TestService testService;
    private final ModelMapper modelMapper;

    @ResponseBody
    @GetMapping("/chooseTheme")
    public List<TestInfoDTO> getTestNameAndDescriptionFromTopic(@RequestParam(value = "theme", required = false)String topicName, HttpSession session){
        List<Test> tests = testService.getTestsByTopicName(topicName);
        session.setAttribute("tests", tests);
        if(tests.isEmpty()){
            return new ArrayList<>();
        } else {
            List<TestInfoDTO> list = new ArrayList<>();
            for (Test test : tests) {
                if (test.getQuestions().size() != 0) {
                    TestInfoDTO testInfoDTO = convertToDTO(test);
                    list.add(testInfoDTO);
                }
            }
            return list;
        }
    }

    private TestInfoDTO convertToDTO(Test test){
        return modelMapper.map(test, TestInfoDTO.class);
    }
}
