package com.AppCobranza.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DailySummaryDTO {
    private BigDecimal totalCollected;
    private BigDecimal totalSpent;
    private BigDecimal netCash;
}
