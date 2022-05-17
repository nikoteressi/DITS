package com.example.dits.service;

import com.example.dits.dto.TestStatisticByUser;
import com.example.dits.entity.*;

import java.util.List;
import java.util.Map;

public interface StatisticService {
    void create(Statistic st);
    void update(Statistic st, int id);
    void delete(Statistic st);
    void save(Statistic st);
    List<Statistic> findAll();
    void saveMapOfStat(Map<String, Statistic> map, String endTest);
    List<TestStatisticByUser> getListOfTestsWithStatisticsByUser(User user);
    List<Statistic> getUserStatistics(User user);
    List<Statistic> getStatisticByQuestion(Question question);
    void saveStatisticsToDB(List<Statistic> statistics);
    void removeStatisticByUserId(int userid);
    void deleteAll();
}
