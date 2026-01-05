package com.AppCobranza.controller;

import com.AppCobranza.dto.ClientDTO;
import com.AppCobranza.model.Client;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.ClientRepository;
import com.AppCobranza.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getClients() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        // Return only clients created by this user
        List<ClientDTO> clients = clientRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clients);
    }

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        Client client = Client.builder()
                .name(request.getName())
                .dni(request.getDni())
                .address(request.getAddress())
                .phone(request.getPhone())
                .user(user)
                .build();

        Client saved = clientRepository.save(client);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    private ClientDTO mapToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .dni(client.getDni())
                .address(client.getAddress())
                .phone(client.getPhone())
                .build();
    }
}
