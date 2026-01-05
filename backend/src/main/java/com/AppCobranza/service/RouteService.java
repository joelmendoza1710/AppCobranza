package com.AppCobranza.service;

import com.AppCobranza.dto.RouteDTO;
import com.AppCobranza.model.Client;
import com.AppCobranza.model.Loan;
import com.AppCobranza.model.Payment;
import com.AppCobranza.model.User;
import com.AppCobranza.model.LoanStatus;
import com.AppCobranza.repository.ClientRepository;
import com.AppCobranza.repository.LoanRepository;
import com.AppCobranza.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final ClientRepository clientRepository;
    private final LoanRepository loanRepository;
    private final PaymentRepository paymentRepository;

    public List<RouteDTO> getMyRoute(User user) {
        // 1. Get all clients for this user
        List<Client> clients = clientRepository.findAllByUserId(user.getId());

        // 2. Filter clients who have ACTIVE loans
        // Or should we show all clients? Usually only those with active loans.
        // Let's filter by Active Loans only for the collections route.
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        List<RouteDTO> route = new ArrayList<>();

        for (Client client : clients) {
            // Find active loan for client
            List<Loan> activeLoans = loanRepository.findAllByUserId(user.getId()).stream()
                    .filter(l -> l.getClient().getId().equals(client.getId()) && l.getStatus() == LoanStatus.ACTIVE)
                    .collect(Collectors.toList());

            if (activeLoans.isEmpty())
                continue; // Skip clients with no active debt

            // Assuming 1 active loan per client for simplicity, take the first one
            Loan loan = activeLoans.get(0);

            // Check payments today
            // We need to fetch payments for this loan made TODAY
            // Ideally PaymentRepo should have findByLoanId(loanId)
            List<Payment> todayPayments = paymentRepository.findAllByUserId(user.getId()).stream() // This is
                                                                                                   // inefficient,
                                                                                                   // should use repo
                                                                                                   // method
                    .filter(p -> p.getLoan().getId().equals(loan.getId()))
                    .filter(p -> !p.getDate().isBefore(startOfDay) && !p.getDate().isAfter(endOfDay))
                    .collect(Collectors.toList());

            BigDecimal paidAmount = todayPayments.stream()
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String status = "PENDING";
            if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
                status = "PAID";
            } else {
                // Check if "SKIPPED". How do we track skipped?
                // For now, if there is a payment of 0 amount, we consider it SKIPPED.
                // Ideally we should have a `Visit` entity.
                // Let's use the helper method logic: if any payment has amount 0 -> SKIPPED.
                boolean isSkipped = todayPayments.stream().anyMatch(p -> p.getAmount().compareTo(BigDecimal.ZERO) == 0);
                if (isSkipped)
                    status = "SKIPPED";
            }

            route.add(RouteDTO.builder()
                    .clientId(client.getId())
                    .clientName(client.getName())
                    .address(client.getAddress())
                    .routeOrder(client.getRouteOrder() != null ? client.getRouteOrder() : 0)
                    .statusToday(status)
                    .paidTodayAmount(paidAmount)
                    .loanId(loan.getId())
                    .installmentAmount(loan.getInstallmentAmount())
                    .remainingBalance(loan.getRemainingBalance())
                    .build());
        }

        // Sort by route order
        // Sort logic:
        // 1. PENDING and SKIPPED first (priority 0)
        // 2. PAID last (priority 1)
        // 3. Within same priority, sort by routeOrder
        route.sort((r1, r2) -> {
            int priority1 = "PAID".equals(r1.getStatusToday()) ? 1 : 0;
            int priority2 = "PAID".equals(r2.getStatusToday()) ? 1 : 0;

            if (priority1 != priority2) {
                return Integer.compare(priority1, priority2);
            }
            return Integer.compare(r1.getRouteOrder(), r2.getRouteOrder());
        });

        return route;
    }
}
