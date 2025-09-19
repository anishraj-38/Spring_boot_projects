package com.example.realchatapplication.listener;

import com.example.realchatapplication.model.ChatMessage;
import com.example.realchatapplication.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketListener {

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(WebSocketListener.class);

    @EventListener
    public void handleWebsocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // Example: username passed as a STOMP header during CONNECT
        String username = headerAccessor.getFirstNativeHeader("username");

        if (username != null) {
            // Store username in session so it can be retrieved on disconnect
            headerAccessor.getSessionAttributes().put("username", username);

            userService.setUserOnlineStatus(username, true);
            logger.info("User {} connected to websocket", username);

            // Optionally broadcast a JOIN message
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.JOIN);
            chatMessage.setSender(username);
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        } else {
            logger.warn("Websocket connected without username header");
        }
    }

    @EventListener
    public void handleWebsocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getSessionAttributes() != null) {
            Object usernameObj = headerAccessor.getSessionAttributes().get("username");

            if (usernameObj != null) {
                String username = usernameObj.toString();

                userService.setUserOnlineStatus(username, false);
                logger.info("User {} disconnected from websocket", username);

                ChatMessage chatMessage = new ChatMessage();
                chatMessage.setType(ChatMessage.MessageType.LEAVE);
                chatMessage.setSender(username);
                messagingTemplate.convertAndSend("/topic/public", chatMessage);

            } else {
                logger.warn("No username found in session attributes during disconnect.");
            }
        } else {
            logger.warn("No session attributes found during disconnect.");
        }
    }
}
