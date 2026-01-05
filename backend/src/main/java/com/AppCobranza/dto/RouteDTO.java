package com.AppCobranza.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class RouteDTO {
    private Long clientId;
    private String clientName;
    private String address;
    private int routeOrder;

    // Status Logic
    private String statusToday; // PAID, SKIPPED, PENDING
    private BigDecimal paidTodayAmount;

    // Loan Info (Optional but useful)
    private Long loanId;
    private BigDecimal installmentAmount;
    private BigDecimal remainingBalance;
}
