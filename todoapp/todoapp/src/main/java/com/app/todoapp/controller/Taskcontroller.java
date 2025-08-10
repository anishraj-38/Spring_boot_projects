package com.app.todoapp.controller;

import com.app.todoapp.Repository.TaskRespository;
import com.app.todoapp.Services.Taskservices;
import com.app.todoapp.models.Task;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
//@RequestMapping("/tasks")
public class Taskcontroller {

    private final Taskservices taskservices;


    public Taskcontroller(Taskservices taskservices) {
        this.taskservices = taskservices;
    }

    @GetMapping
    public String getTasks(Model model) {
        List<Task> tasks = taskservices.getAllTasks();
        model.addAttribute("tasks", tasks);
        return "tasks";
    }

    @PostMapping
    public String createTasks(@RequestParam String title) {
        taskservices.createTasks(title);
        return "redirect:/";
    }

    @GetMapping("/{id}/delete")
    public String deleteTasks(@PathVariable Long id) {
        taskservices.deleteTasks(id);
        return "redirect:/";
    }

    @GetMapping("/{id}/toggle")
    public String toggleTasks(@PathVariable Long id) {
        taskservices.toggleTasks(id);
        return "redirect:/";
    }

    @Controller
    public class LoginController {

        @GetMapping("/login")
        public String showLoginPage() {
            return "login";
        }
    }

}
