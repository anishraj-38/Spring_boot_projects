package com.application.kolam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    // Test endpoint - no authentication required
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Server is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    // Test POST endpoint - no authentication required
    @PostMapping("/test")
    public ResponseEntity<?> testPost(@RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "POST request received!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("received_body", body);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    // Simple auth test endpoint
    @PostMapping("/auth/test")
    public ResponseEntity<?> authTest(@RequestBody(required = false) Map<String, Object> loginData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Auth endpoint is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("login_data", loginData);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}