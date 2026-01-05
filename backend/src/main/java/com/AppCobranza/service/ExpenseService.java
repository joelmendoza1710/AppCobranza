package com.AppCobranza.service;

import com.AppCobranza.dto.DailySummaryDTO;
import com.AppCobranza.dto.ExpenseDTO;
import com.AppCobranza.model.Expense;
import com.AppCobranza.model.Payment;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.ExpenseRepository;
import com.AppCobranza.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final PaymentRepository paymentRepository;

    public ExpenseDTO createExpense(ExpenseDTO request, User user) {
        Expense expense = Expense.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .category(request.getCategory())
                .date(LocalDateTime.now())
                .user(user)
                .build();

        Expense saved = expenseRepository.save(expense);

        return ExpenseDTO.builder()
                .id(saved.getId())
                .description(saved.getDescription())
                .amount(saved.getAmount())
                .category(saved.getCategory())
                .date(saved.getDate())
                .build();
    }

    public List<ExpenseDTO> getTodayExpenses(User user) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        return expenseRepository.findByUserIdAndDateBetween(user.getId(), startOfDay, endOfDay)
                .stream()
                .map(e -> ExpenseDTO.builder()
                        .id(e.getId())
                        .description(e.getDescription())
                        .amount(e.getAmount())
                        .category(e.getCategory())
                        .date(e.getDate())
                        .build())
                .collect(Collectors.toList());
    }

    public DailySummaryDTO getDailySummary(User user) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        // Calculate Total Collected Today
        // Note: PaymentRepository needs a similar method findByUserIdAndDateBetween
        // which might not exist or needs custom query.
        // Assuming PaymentRepository has a method or we fetch all and filter
        // (inefficient but works for MVP).
        // Let's rely on PaymentRepository having a findByUserIdAndDateBetween, if not I
        // need to add it.
        // Actually Payment only has date (which is now LocalDateTime), so finding by
        // range works.

        List<Payment> payments = paymentRepository.findAllByUserId(user.getId())
                .stream()
                .filter(p -> !p.getDate().isBefore(startOfDay) && !p.getDate().isAfter(endOfDay))
                .collect(Collectors.toList());

        BigDecimal totalCollected = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Total Spent Today
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), startOfDay, endOfDay);
        BigDecimal totalSpent = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DailySummaryDTO.builder()
                .totalCollected(totalCollected)
                .totalSpent(totalSpent)
                .netCash(totalCollected.subtract(totalSpent))
                .build();
    }
}
