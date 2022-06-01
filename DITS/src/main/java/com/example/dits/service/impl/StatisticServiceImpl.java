package com.example.dits.service.impl;

import com.example.dits.DAO.StatisticRepository;
import com.example.dits.dto.*;
import com.example.dits.entity.*;
import com.example.dits.service.StatisticService;
import com.example.dits.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final StatisticRepository repository;
    private final TopicService topicService;

    @Transactional
    public void create(Statistic statistic) {
        repository.save(statistic);
    }

    @Transactional
    public void update(Statistic statistic, int id) {
        Optional<Statistic> st = repository.findById(id);
        if (st.isPresent()) repository.save(statistic);
    }

    @Transactional
    public void delete(Statistic statistic) {
        repository.delete(statistic);
    }

    @Transactional
    public void save(Statistic statistic) {
        repository.save(statistic);
    }

    @Transactional
    public void saveMapOfStat(Map<String, Statistic> map, String endTest) {
        for (Statistic st : map.values()) {
            st.setDate(new Date());
        }
    }

    @Transactional
    @Override
    public List<Statistic> getUserStatistics(User user) {
        return repository.getStatisticsByUser(user);
    }

    @Transactional
    @Override
    public List<Statistic> findAll() {
        return repository.findAll();
    }

    @Transactional
    @Override
    public List<Statistic> getStatisticByQuestion(Question question) {
        return repository.getStatisticByQuestion(question);
    }

    @Override
    public void saveStatisticsToDB(List<Statistic> statistics) {
        Date date = new Date();
        for (Statistic statistic : statistics) {
            statistic.setDate(date);
            save(statistic);
        }
    }

    @Transactional
    @Override
    public void removeStatisticByUserId(int userId) {
        repository.removeStatisticByUser_UserId(userId);
    }

    @Transactional
    @Override
    public void deleteAll() {
        repository.deleteAll();
    }

    @Transactional
    public List<TestStatisticByUser> getListOfTestsWithStatisticsByUser(User user) {
        List<Statistic> statisticsByUser = repository.getStatisticsByUser(user);
        List<Test> testsPassedByUser = statisticsByUser.stream().map(f -> f.getQuestion().getTest()).distinct().collect(Collectors.toList());
        List<String> namesOfTopicAndTest = getNamesOfTopicAndTest(testsPassedByUser);
        List<List<Statistic>> listStatisticsByTestName = getListStatisticsByTestName(statisticsByUser, namesOfTopicAndTest);
        return getTestStatisticsByUser(listStatisticsByTestName);
    }

    @Transactional
    public List<TestStatisticByUser> getListOfTestsWithStatisticsByUserId(int id) {
        List<Statistic> statisticsByUser = repository.getStatisticsByUser_UserId(id);
        List<Test> testsPassedByUser = statisticsByUser.stream().map(f -> f.getQuestion().getTest()).distinct().collect(Collectors.toList());
        List<String> namesOfTopicAndTest = getNamesOfTopicAndTest(testsPassedByUser);
        List<List<Statistic>> listStatisticsByTestName = getListStatisticsByTestName(statisticsByUser, namesOfTopicAndTest);
        return getTestStatisticsByUser(listStatisticsByTestName);
    }

    private List<List<Statistic>> getListStatisticsByTestName(List<Statistic> statisticsByUser, List<String> namesOfTopicAndTest) {
        List<List<Statistic>> listStatisticsByTestName = new ArrayList<>();
        for (String s : namesOfTopicAndTest) {
           listStatisticsByTestName.add(statisticsByUser.stream()
                   .filter(f -> s.contains(f.getQuestion().getTest().getName()))
                   .collect(Collectors.toList()));
        }
        return listStatisticsByTestName;
    }


    private List<TestStatisticByUser> getTestStatisticsByUser(List<List<Statistic>> listStatisticsByTestName) {
        List<TestStatisticByUser>testStatisticByUsers = new ArrayList<>();
        String testName;
        String topicName;
        String topicTestName;
        int attempts;
        int rightAnswers;

            for (List<Statistic> s : listStatisticsByTestName) {
                attempts = s.size();
                rightAnswers = numberOfRightAnswers(s);
                topicName = s.stream().map(f -> f.getQuestion().getTest().getTopic().getName()).findFirst().get();
                testName = s.stream().map(f -> f.getQuestion().getTest().getName()).findFirst().get();
                topicTestName = topicName + " / " + testName;
                testStatisticByUsers.add(new TestStatisticByUser(topicTestName, attempts, calculateAvg(attempts, rightAnswers)));
            }
        return testStatisticByUsers;
    }

    private List<String> getNamesOfTopicAndTest(List<Test> testsPassedByUser) {
        List<String> namesOfTopicAndTest = new ArrayList<>();
        String topicName;
        String testName;
        for (Test t : testsPassedByUser) {
            topicName = t.getTopic().getName();
            testName = t.getName();
            namesOfTopicAndTest.add(topicName + " / " + testName);
        }
        return namesOfTopicAndTest;
    }

    private Map<String, Integer> getTestNamesAndAttempts(List<Statistic> statisticsByUser,  List<String> namesOfTopicAndTest) {
        Map<String, Integer> attemptsOfPassing = new HashMap<>();
        int attemptsCounter;
        for (String s : namesOfTopicAndTest) {
            attemptsCounter = (int) statisticsByUser.stream().filter(f -> s.contains(f.getQuestion().getTest().getName())).count();
            attemptsOfPassing.put(s, attemptsCounter);
        }
        return attemptsOfPassing;
    }

    @Transactional
    public List<TestStatistic> getListOfTestsWithStatisticsByTopic(int topicId) {
        Topic topic = topicService.getTopicByTopicId(topicId);
        return getTestStatistics(topic);
    }

    private List<TestStatistic> getTestStatistics(Topic topic) {
        List<Test> testLists = topic.getTestList();
        List<TestStatistic> testStatistics = new ArrayList<>();

        setTestLists(testLists, testStatistics);
        Collections.sort(testStatistics);
        return testStatistics;
    }

    private void setTestLists(List<Test> testLists, List<TestStatistic> testStatistics) {
        for (Test test : testLists) {

            List<Question> questionList = test.getQuestions();
            List<QuestionStatistic> questionStatistics = new ArrayList<>();
            QuestionStatisticAttempts statisticAttempts = new QuestionStatisticAttempts(0, 0, 0);
            setQuestionStatistics(questionList, questionStatistics, statisticAttempts);
            Collections.sort(questionStatistics);

            int testAverage = calculateTestAverage(statisticAttempts.getTestSumAvg(), questionStatistics.size());
            testStatistics.add(new TestStatistic(test.getName(), statisticAttempts.getNumberOfAttempts(),
                    testAverage, questionStatistics));
        }
    }

    private void setQuestionStatistics(List<Question> questionList, List<QuestionStatistic> questionStatistics,
                                       QuestionStatisticAttempts statisticAttempts) {
        for (Question question : questionList) {

            List<Statistic> statisticList = getStatisticByQuestion(question);
            statisticAttempts.setNumberOfAttempts(statisticList.size());
            int rightAnswers = numberOfRightAnswers(statisticList);
            if (statisticAttempts.getNumberOfAttempts() != 0)
                statisticAttempts.setQuestionAvg(calculateAvg(statisticAttempts.getNumberOfAttempts(), rightAnswers));

            statisticAttempts.setTestSumAvg(statisticAttempts.getTestSumAvg() + statisticAttempts.getQuestionAvg());
            questionStatistics.add(new QuestionStatistic(question.getDescription(),
                    statisticAttempts.getNumberOfAttempts(), statisticAttempts.getQuestionAvg()));
        }
    }

    private int numberOfRightAnswers(List<Statistic> statisticList) {
        int rightAnswer = 0;
        rightAnswer = getRightAnswer(statisticList, rightAnswer);
        return rightAnswer;
    }

    private int getRightAnswer(List<Statistic> statisticList, int rightAnswer) {
        for (Statistic statistic : statisticList) {
            if (statistic.isCorrect())
                rightAnswer++;
        }
        return rightAnswer;
    }

    private int calculateTestAverage(int testSumAvg, int questionStatisticsSize) {
        if (questionStatisticsSize != 0)
            return testSumAvg / questionStatisticsSize;
        else
            return testSumAvg;
    }

    private int calculateAvg(int count, double rightAnswer) {
        return (int) (rightAnswer / count * 100);
    }
}
