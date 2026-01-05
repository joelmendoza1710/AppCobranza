package com.AppCobranza.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private BigDecimal interestPercentage; // Now dynamic %, e.g., 20.0
    private Integer installments; // Number of payments (days or weeks)

    @Enumerated(EnumType.STRING)
    private PaymentFrequency paymentFrequency;

    private BigDecimal installmentAmount; // Fixed amount per payment
    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal totalToPay;
    private BigDecimal remainingBalance;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Client client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;
}
