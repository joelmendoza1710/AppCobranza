package com.AppCobranza.controller;

import com.AppCobranza.dto.DailySummaryDTO;
import com.AppCobranza.dto.ExpenseDTO;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.UserRepository;
import com.AppCobranza.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    private User getAuthUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody ExpenseDTO request) {
        return ResponseEntity.ok(expenseService.createExpense(request, getAuthUser()));
    }

    @GetMapping("/today")
    public ResponseEntity<List<ExpenseDTO>> getTodayExpenses() {
        return ResponseEntity.ok(expenseService.getTodayExpenses(getAuthUser()));
    }

    @GetMapping("/summary")
    public ResponseEntity<DailySummaryDTO> getDailySummary() {
        return ResponseEntity.ok(expenseService.getDailySummary(getAuthUser()));
    }
}
