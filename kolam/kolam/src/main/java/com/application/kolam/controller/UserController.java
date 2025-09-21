package com.application.kolam.controller;

import com.application.kolam.dto.UserResponse;
import com.application.kolam.entity.User;
import com.application.kolam.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return ResponseEntity.ok(
                new UserResponse(user.getId(), user.getUsername(), user.getEmail())
        );
    }
}

