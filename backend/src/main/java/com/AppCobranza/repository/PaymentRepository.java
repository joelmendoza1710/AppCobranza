package com.AppCobranza.repository;

import com.AppCobranza.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;
import java.math.BigDecimal;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findAllByUserId(Long userId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user.id = :userId AND p.date = :date")
    BigDecimal sumPaymentsByUserIdAndDate(Long userId, LocalDate date);
}
