package com.AppCobranza.service;

import com.AppCobranza.dto.SummaryDTO;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.ExpenseRepository;
import com.AppCobranza.repository.LoanRepository;
import com.AppCobranza.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.AppCobranza.model.Expense;
import com.AppCobranza.model.Payment;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;
    private final ExpenseRepository expenseRepository;

    public SummaryDTO getSummary(User user) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // Sum Payments
        List<Payment> payments = paymentRepository.findAllByUserId(user.getId());
        BigDecimal collectedToday = payments.stream()
                .filter(p -> !p.getDate().isBefore(startOfDay) && !p.getDate().isAfter(endOfDay))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Sum Expenses
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), startOfDay, endOfDay);
        BigDecimal expensesToday = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int activeLoans = loanRepository.findActiveLoansByUserId(user.getId()).size();

        // cashOnHand: (Cobrado - Gastado)
        BigDecimal cashOnHand = collectedToday.subtract(expensesToday);

        return SummaryDTO.builder()
                .collectedToday(collectedToday)
                .cashOnHand(cashOnHand)
                .expensesToday(expensesToday)
                .activeLoans(activeLoans)
                .build();
    }
}
