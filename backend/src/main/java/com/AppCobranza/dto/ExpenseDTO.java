package com.AppCobranza.dto;

import com.AppCobranza.model.ExpenseCategory;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ExpenseDTO {
    private Long id;
    private String description;
    private BigDecimal amount;
    private ExpenseCategory category;
    private LocalDateTime date;
}
