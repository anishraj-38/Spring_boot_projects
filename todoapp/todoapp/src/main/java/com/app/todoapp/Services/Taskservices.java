package com.app.todoapp.Services;

import com.app.todoapp.Repository.TaskRespository;
import com.app.todoapp.models.Task;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Taskservices {

    private final TaskRespository taskRespository;

    public Taskservices(TaskRespository taskRespository) {
        this.taskRespository = taskRespository;
    }

    public List<Task> getAllTasks() {
        return taskRespository.findAll();
    }

    public void createTasks(String title) {
        Task task = new Task();
        task.setTitle(title);
        task.setCompleted(false);
        taskRespository.save(task);
    }

    public void deleteTasks(Long id) {
        taskRespository.deleteById(id);
    }

    public void toggleTasks(Long id) {
        Task task = taskRespository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid task id"));
        task.setCompleted(!task.isCompleted());
        taskRespository.save(task);
    }




}