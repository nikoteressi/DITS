package com.example.dits.service.impl;

import com.example.dits.DAO.TopicRepository;
import com.example.dits.entity.Topic;
import com.example.dits.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TopicServiceImpl implements TopicService {

    private final TopicRepository repository;

    @Transactional
    public void create(Topic topic) {
        repository.save(topic);
    }

    @Transactional
    public void update(Topic topic, int id) {
        Optional<Topic> t = repository.findById(id);
        if(t.isEmpty())
            return;
        else
            repository.save(topic);
    }

    @Transactional
    public void delete(Topic topic) {
        repository.delete(topic);
    }

    @Transactional
    public void save(Topic topic) {
        repository.save(topic);
    }

    @Transactional
    public List<Topic> findAll() {
        return repository.findAll();
    }

    @Transactional
    public Topic getTopicByName(String name) {
        return repository.getTopicByName(name);
    }

    @Override
    public Topic getTopicByTopicId(int topicId) {
        return repository.getTopicByTopicId(topicId);
    }

    @Transactional
    @Override
    public void removeTopicByTopicId(int topicId) {
        repository.removeTopicByTopicId(topicId);
    }

    @Transactional
    @Override
    public void updateTopicName(int topicId, String name) {
        Topic topicByTopicId = repository.getTopicByTopicId(topicId);
        topicByTopicId.setName(name);
    }
}
