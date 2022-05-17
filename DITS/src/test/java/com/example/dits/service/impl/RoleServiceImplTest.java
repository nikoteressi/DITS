package com.example.dits.service.impl;

import com.example.dits.DAO.RoleRepository;
import com.example.dits.entity.Role;
import com.example.dits.service.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@SpringBootTest
class RoleServiceImplTest {
    @Autowired
    @Qualifier("roleServiceImpl")
    private RoleService service;
    @MockBean
    private RoleRepository repository;

    @MockBean
    private Role role;

    @Test
    void shouldInvokeMethodSaveFromRepository() {
        service.save(role);
        verify(repository, times(1)).save(role);
        verifyNoMoreInteractions(repository);
    }

    @Test
    void shouldReturnFromUpdateWhenThereIsNoRoleById() {
        when(repository.findById(anyInt())).thenReturn(Optional.empty());
        service.update(role,anyInt());
        verify(repository,times(1)).findById(anyInt());
        verifyNoMoreInteractions(repository);
    }

    @Test
    void shouldInvokeSaveOnRepositoryWhenThereIsRoleById(){
        when(repository.findById(anyInt())).thenReturn(Optional.of(new Role()));
        service.update(role,anyInt());
        verify(repository,times(1)).findById(anyInt());
        verify(repository,times(1)).save(role);
        verifyNoMoreInteractions(repository);
    }

    @Test
    void shouldInvokeDeleteOnRepository(){
        service.delete(role);
        verify(repository,times(1)).delete(role);
        verifyNoMoreInteractions(repository);
    }

    @Test
    void shouldInvokeFindAllOnRepository(){
        service.findAll();
        verify(repository,times(1)).findAll();
        verifyNoMoreInteractions(repository);
    }

}