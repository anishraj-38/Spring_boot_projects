package com.chat.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Server → Client
        config.enableSimpleBroker("/topic", "/queue");

        // Client → Server
        config.setApplicationDestinationPrefixes("/app");

        // For private messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS fallback
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173","http://localhost:3000")
                .withSockJS();

        // Native WebSocket (better for production)
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173","http://localhost:3000");
    }
}
