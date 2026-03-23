package com.research.assistant.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.research.assistant.DTO.OpenRouter;
import com.research.assistant.DTO.ResearchRequest;
import com.research.assistant.Entity.ResearchData;
import com.research.assistant.Repository.ResearchRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class ResearchService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    private final String openRouterApiUrl;
    private final String openRouterApiKey;
    private final ResearchRepository researchRepository; // ✅ DB

    public ResearchService(
            WebClient.Builder webClientBuilder,
            ObjectMapper objectMapper,
            ResearchRepository researchRepository,
            @Value("${open.router.api.url}") String openRouterApiUrl,
            @Value("${open.router.api.key}") String openRouterApiKey
    ) {
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = objectMapper;
        this.researchRepository = researchRepository;
        this.openRouterApiUrl = openRouterApiUrl;
        this.openRouterApiKey = openRouterApiKey;
    }

    public String processContent(ResearchRequest request) {


        if ("save".equalsIgnoreCase(request.getOperation())) {

            ResearchData data = new ResearchData();
            data.setContent(request.getContent());
            data.setOperation("save");
            data.setResult("Saved manually from extension");

            researchRepository.save(data);

            return "Notes saved successfully";
        }


        String prompt = buildPrompt(request);

        Map<String, Object> requestBody = Map.of(
                "model", "openai/gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            String response = webClientBuilder.build()
                    .post()
                    .uri(openRouterApiUrl)
                    .header("Authorization", "Bearer " + openRouterApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String result = extractTextFromResponse(response);


            ResearchData data = new ResearchData();
            data.setContent(request.getContent());
            data.setOperation(request.getOperation());
            data.setResult(result);

            researchRepository.save(data);

            return result;

        } catch (WebClientResponseException e) {
            return "API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private String extractTextFromResponse(String response) {
        try {
            OpenRouter chatResponse = objectMapper.readValue(response, OpenRouter.class);
            if (chatResponse.getChoices() != null && !chatResponse.getChoices().isEmpty()) {
                return chatResponse.getChoices().get(0).getMessage().getContent();
            }
            return "No content found in response";
        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
        }
    }

    private String buildPrompt(ResearchRequest request) {
        StringBuilder prompt = new StringBuilder();

        switch (request.getOperation()) {
            case "summarize":
                prompt.append("Please provide a clear and concise summary of the following text:\n\n");
                break;

            case "suggest":
                prompt.append("Based on the following text, suggest related topics and further reading with headings and bullet points:\n\n");
                break;

            default:
                throw new IllegalArgumentException("Unknown operation: " + request.getOperation());
        }

        prompt.append(request.getContent());
        return prompt.toString();
    }
}
