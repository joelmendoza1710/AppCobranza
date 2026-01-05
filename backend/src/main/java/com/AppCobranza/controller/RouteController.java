package com.AppCobranza.controller;

import com.AppCobranza.dto.RouteDTO;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.UserRepository;
import com.AppCobranza.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<RouteDTO>> getMyRoute() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(routeService.getMyRoute(user));
    }
}
