package com.app.todoapp.controller;

import com.app.todoapp.Services.UserServices;
import com.app.todoapp.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {

    @Autowired
    private UserServices userServices;

    @GetMapping("/regPage")
    public String openRegPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/regForm")
    public String submitRegForm(@ModelAttribute("user") User user, Model model) {
        boolean status = userServices.registerUser(user);
        if (status) {
            model.addAttribute("message", "User successfully registered!");
        } else {
            model.addAttribute("error", "Registration failed. Try again.");
        }
        return "register";
    }

    @GetMapping("/loginPage")
    public String openLoginPage(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }
    @PostMapping("/loginForm")
    public String processLogin(@ModelAttribute("user") User user, Model model) {
        User existingUser = userServices.getUserByUsername(user.getUsername());

        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            model.addAttribute("message", "Login successful!");
            return "redirect:/"; // Or your dashboard
        } else {
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }
}
