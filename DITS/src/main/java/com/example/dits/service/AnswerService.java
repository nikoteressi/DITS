package com.example.dits.service;

import com.example.dits.entity.Answer;
import com.example.dits.entity.Question;

import java.util.List;

public interface AnswerService {

    void create(Answer a);
    void update(Answer a, int id);
    void delete(Answer a);
    void save(Answer a);
    List<Answer> findAll();
    List<Answer> getAnswersByQuestion(Question question);
    List<Answer> getAnswersFromQuestionList(List<Question> questionList, int index);
    boolean isRightAnswer(List<Integer> answeredQuestion, List<Question> questionList, int questionNumber);

}
