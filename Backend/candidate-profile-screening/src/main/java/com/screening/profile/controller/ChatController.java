package com.screening.profile.controller;

import com.screening.profile.dto.ChatRequestDTO;
import com.screening.profile.dto.ChatResponseDTO;
import com.screening.profile.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ChatResponseDTO handleMessage(@RequestBody ChatRequestDTO request) {
        return chatService.processUserMessage(request.getMessage());
    }
}