package com.AppCobranza.repository;

import com.AppCobranza.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
