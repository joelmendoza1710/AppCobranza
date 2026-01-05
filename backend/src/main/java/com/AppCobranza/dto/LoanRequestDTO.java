package com.AppCobranza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanRequestDTO {
    private BigDecimal amount;
    private BigDecimal interestPercentage;
    private String paymentFrequency; // "DAILY" or "WEEKLY"
    private int installments; // Number of dues
    private Long clientId;
}
