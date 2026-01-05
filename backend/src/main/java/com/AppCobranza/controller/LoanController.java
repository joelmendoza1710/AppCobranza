package com.AppCobranza.controller;

import com.AppCobranza.dto.LoanRequestDTO;
import com.AppCobranza.dto.PaymentDTO;
import com.AppCobranza.model.Loan;
import com.AppCobranza.model.Payment;
import com.AppCobranza.model.User;
import com.AppCobranza.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody LoanRequestDTO request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.createLoan(request, user));
    }

    @PostMapping("/pay")
    public ResponseEntity<Payment> registerPayment(@RequestBody PaymentDTO request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.registerPayment(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getLoans(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.getLoansByUser(user));
    }
}
