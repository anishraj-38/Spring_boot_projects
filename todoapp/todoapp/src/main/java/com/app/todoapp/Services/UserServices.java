package com.app.todoapp.Services;


import com.app.todoapp.models.User;

public interface UserServices {
    boolean registerUser(User user);
    User getUserByUsername(String username);
}
