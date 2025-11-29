package com.wnd.wndapi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status")
@CrossOrigin(origins = "*")
public class StatusController {

    @GetMapping
    public Map<String, String> status() {
        Map<String, String> resposta = new HashMap<>();
        resposta.put("app", "Why Not Data - API");
        resposta.put("status", "OK");
        return resposta;
    }
}
