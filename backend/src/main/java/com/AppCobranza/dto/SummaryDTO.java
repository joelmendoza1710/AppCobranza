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
public class SummaryDTO {
    private BigDecimal collectedToday;
    private BigDecimal cashOnHand;
    private BigDecimal expensesToday;
    private int activeLoans;
}
