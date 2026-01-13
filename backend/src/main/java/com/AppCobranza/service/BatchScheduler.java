package com.AppCobranza.service;

import com.AppCobranza.model.Loan;
import com.AppCobranza.model.LoanStatus;
import com.AppCobranza.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BatchScheduler {

    private final LoanRepository loanRepository;

    /**
     * Runs every day at midnight to update loan statuses.
     * Logic:
     * - White (AL_DIA): Paid >= Expected
     * - Red (MORA): Paid < Expected
     * - Green (ADELANTADO): Paid > Expected (Significantly)
     * - Purple (VENCIDO_CARTERA): Date > EndDate AND Balance > 0
     */
    @Scheduled(cron = "0 0 0 * * ?") // Midnight
    public void updateLoanStatuses() {
        log.info("Starting Daily Batch Process: Loan Status Update");

        // Fetch all non-finished loans (Active, Late, etc)
        // Ideally we should have a method to fetch all except PAID
        List<Loan> activeLoans = loanRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Loan loan : activeLoans) {
            if (loan.getStatus() == LoanStatus.PAGADO) {
                continue;
            }

            // 1. Check for Cartera Vencida (Purple)
            if (today.isAfter(loan.getEndDate()) && loan.getRemainingBalance().compareTo(BigDecimal.ZERO) > 0) {
                if (loan.getStatus() != LoanStatus.VENCIDO_CARTERA) {
                    loan.setStatus(LoanStatus.VENCIDO_CARTERA);
                    loanRepository.save(loan);
                }
                continue;
            }

            // 2. Calculate Expected Payment
            long daysElapsed = ChronoUnit.DAYS.between(loan.getStartDate(), today);
            if (daysElapsed <= 0)
                daysElapsed = 1; // Avoid zero or negative on day 1

            // Total that should have been paid by now
            // For simplicty assuming DAILY frequency. If weekly, daysElapsed / 7.
            // Adjust logic based on Frequency Enum if needed.
            BigDecimal expectedTotal = loan.getInstallmentAmount().multiply(BigDecimal.valueOf(daysElapsed));

            // Total actually paid = TotalDebt - Remaining
            BigDecimal paidTotal = loan.getTotalToPay().subtract(loan.getRemainingBalance());

            LoanStatus newStatus;

            // Tolerance threshold could be added here
            if (paidTotal.compareTo(expectedTotal) >= 0) {
                // If paid significantly more? For now just AL_DIA or ADELANTADO logic if user
                // wants strictly green
                // Logic: Green if Paid > Expected + 1 Installment?
                BigDecimal oneInstallmentBuffer = expectedTotal.add(loan.getInstallmentAmount());
                if (paidTotal.compareTo(oneInstallmentBuffer) >= 0) {
                    newStatus = LoanStatus.ADELANTADO;
                } else {
                    newStatus = LoanStatus.AL_DIA;
                }
            } else {
                newStatus = LoanStatus.MORA;
            }

            if (loan.getStatus() != newStatus) {
                log.info("Updating Loan ID {} from {} to {}", loan.getId(), loan.getStatus(), newStatus);
                loan.setStatus(newStatus);
                loanRepository.save(loan);
            }
        }

        log.info("Daily Batch Process Completed");
    }
}
