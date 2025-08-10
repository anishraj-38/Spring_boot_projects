package com.email.email_writer.Service;

import com.email.email_writer.Controller.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailGeneratorService {
    @Value("{Gemini.Api.Url}")
    private String GeminiApiUrl;
    @Value("{Gemini.Api.Key}")
    private String GeminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );
        return prompt;
    }

        private String buildPrompt (EmailRequest emailRequest){
            StringBuilder prompt = new StringBuilder();
            ;
            prompt.append("Generate a professional reply for Email.Please do not generate subject line.");
            if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
                prompt.append("Use a ").append(emailRequest.getTone()).append("tone.");
            }
            prompt.append("\nOriginal Email : \n").append(emailRequest.getEmailContent());
            return null;
        }
    }
