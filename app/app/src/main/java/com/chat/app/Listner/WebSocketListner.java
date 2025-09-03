package com.chat.app.Listner;

import com.chat.app.Service.UserService;
import com.chat.app.models.Message;
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
public class WebSocketListner {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketListner.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebsocketConnectListener(SessionConnectedEvent event) {
        logger.info("✅ Connected to websocket");
    }

    @EventListener
    public void handleWebsocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        Object usernameObj = headerAccessor.getSessionAttributes().get("username");
        if (usernameObj != null) {
            String username = usernameObj.toString();
            logger.info("❌ User disconnected: {}", username);

            userService.setUserOnlineStatus(username, false);

            Message message = new Message();
            message.setType(Message.MessageType.LEAVE);
            message.setSender(username);
            messagingTemplate.convertAndSend("/topic/public", message);
        }
    }
}
