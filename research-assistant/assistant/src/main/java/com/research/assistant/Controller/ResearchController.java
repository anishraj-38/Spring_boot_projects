package com.research.assistant.Controller;

import com.research.assistant.DTO.ResearchRequest;
import com.research.assistant.Service.ResearchService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ResearchController {

    private final ResearchService researchService;

    @PostMapping("/process")
    public ResponseEntity<?> processContent(@Valid @RequestBody ResearchRequest request) {

        if (request.getContent() == null || request.getContent().isBlank()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }
        if (request.getOperation() == null || request.getOperation().isBlank()) {
            return ResponseEntity.badRequest().body("Operation cannot be empty");
        }

        try {
            String result = researchService.processContent(request);

            if (result.startsWith("API Error:") || result.startsWith("Error:")) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(result);
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }
}
