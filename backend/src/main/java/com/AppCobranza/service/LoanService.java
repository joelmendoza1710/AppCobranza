package com.AppCobranza.service;

import com.AppCobranza.dto.LoanRequestDTO;
import com.AppCobranza.dto.PaymentDTO;
import com.AppCobranza.model.Client;
import com.AppCobranza.model.Loan;
import com.AppCobranza.model.Payment;
import com.AppCobranza.model.User;
import com.AppCobranza.repository.ClientRepository;
import com.AppCobranza.repository.LoanRepository;
import com.AppCobranza.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final ClientRepository clientRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public Loan createLoan(LoanRequestDTO request, User user) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        // 1. Calculate Total to Pay: Amount * (1 + Interest/100)
        BigDecimal interestFactor = request.getInterestPercentage().divide(BigDecimal.valueOf(100), 4,
                RoundingMode.HALF_UP);
        BigDecimal totalToPay = request.getAmount().add(request.getAmount().multiply(interestFactor));

        // 2. Calculate Installment Amount: Total / Installments
        BigDecimal installmentAmount = totalToPay.divide(BigDecimal.valueOf(request.getInstallments()), 2,
                RoundingMode.HALF_UP);

        // 3. Calculate End Date based on Frequency
        com.AppCobranza.model.PaymentFrequency frequency = com.AppCobranza.model.PaymentFrequency
                .valueOf(request.getPaymentFrequency());
        LocalDate startDate = LocalDate.now();
        LocalDate endDate;

        if (frequency == com.AppCobranza.model.PaymentFrequency.WEEKLY) {
            endDate = startDate.plusWeeks(request.getInstallments());
        } else {
            // DAILY
            endDate = startDate.plusDays(request.getInstallments());
        }

        Loan loan = Loan.builder()
                .amount(request.getAmount())
                .interestPercentage(request.getInterestPercentage())
                .paymentFrequency(frequency)
                .installments(request.getInstallments())
                .installmentAmount(installmentAmount)
                .startDate(startDate)
                .endDate(endDate)
                .totalToPay(totalToPay)
                .remainingBalance(totalToPay)
                .status(com.AppCobranza.model.LoanStatus.ACTIVE)
                .client(client)
                .user(user)
                .build();

        return loanRepository.save(loan);
    }

    @Transactional
    public Payment registerPayment(PaymentDTO request, User user) {
        Loan loan = loanRepository.findById(request.getLoanId())
                .orElseThrow(() -> new EntityNotFoundException("Loan not found"));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access Denied");
        }

        if (request.getAmount().compareTo(loan.getRemainingBalance()) > 0) {
            throw new IllegalArgumentException("Amount exceeds remaining balance");
        }

        loan.setRemainingBalance(loan.getRemainingBalance().subtract(request.getAmount()));
        if (loan.getRemainingBalance().compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(com.AppCobranza.model.LoanStatus.PAID);
        }
        loanRepository.save(loan);

        Payment payment = Payment.builder()
                .amount(request.getAmount())
                .date(LocalDateTime.now())
                .loan(loan)
                .user(user)
                .build();

        return paymentRepository.save(payment);
    }

    public List<Loan> getLoansByUser(User user) {
        return loanRepository.findAllByUserId(user.getId());
    }
}
