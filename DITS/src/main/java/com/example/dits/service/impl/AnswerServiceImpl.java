package com.example.dits.service.impl;

import com.example.dits.DAO.AnswerRepository;
import com.example.dits.entity.Answer;
import com.example.dits.entity.Question;
import com.example.dits.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository repo;

    @Transactional
    public void create(Answer a) {
        repo.save(a);
    }

    @Transactional
    public void update(Answer a, int id) {
        Optional<Answer> answer = repo.findById(id);
        if(answer.isEmpty())
            return;
        else
            repo.save(a);
    }

    @Transactional
    public void delete(Answer a) {
        repo.delete(a);
    }

    @Transactional
    public void save(Answer a) {
        repo.save(a);
    }

    @Transactional
    public List<Answer> findAll() {
        return repo.findAll();
    }

    @Transactional
    public List<Answer> getAnswersByQuestion(Question question){
        return repo.getAnswersByQuestion(question);
    }

    @Override
    public List<Answer> getAnswersFromQuestionList(List<Question> questionList, int index) {
        return getAnswersByQuestion(questionList.get(index));
    }

    @Override
    public boolean isRightAnswer(List<Integer> answeredQuestion, List<Question> questionList, int questionNumber) {
        List<Answer> prevAnswer = getPreviousAnswers(questionList, questionNumber);
        List<Integer> rightIndexesList = getListOfIndexesOfRightAnswers(prevAnswer);
        if(answeredQuestion == null && rightIndexesList.isEmpty()) {
            return true;
        } else if(answeredQuestion == null && !rightIndexesList.isEmpty()) {
            return false;
        } else {
            return answeredQuestion.equals(rightIndexesList);
        }
    }

    private List<Integer> getListOfIndexesOfRightAnswers(List<Answer> prevAnswer) {
        List<Integer> rightAnswers = new ArrayList<>();
        for (int i = 0; i < prevAnswer.size(); i++) {
            if (prevAnswer.get(i).isCorrect()){
                rightAnswers.add(i);
            }
        }
        return rightAnswers;
    }

    private List<Answer> getPreviousAnswers(List<Question> questionList, int questionNumber) {
        return getAnswersByQuestion(questionList.get(questionNumber - 1));
    }

}
