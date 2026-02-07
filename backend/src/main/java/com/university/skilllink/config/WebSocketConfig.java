package com.university.skilllink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple memory-based message broker to send messages back to the client
        // on destination prefixes "/topic" and "/queue"
        config.enableSimpleBroker("/topic", "/queue");

        // Prefix for messages that are bound for @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");

        // Prefix for user-specific messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register "/ws" endpoint, enabling SockJS fallback options so that it works
        // even if WebSocket is not supported
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins for dev simplicity
                .withSockJS();
    }
}
